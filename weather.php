<?php

declare(strict_types=1);

const WEATHER_CACHE_TTL = 600;
const WEATHER_CONNECT_TIMEOUT = 3;
const WEATHER_REQUEST_TIMEOUT = 6;
const WEATHER_ENDPOINT = "https://api.weatherapi.com/v1/current.json";

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");
header("X-Content-Type-Options: nosniff");

function sendJson(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function failUnavailable(): void
{
    sendJson(["ok" => false, "message" => "天气服务暂时不可用"], 503);
}

function readFreshCache(string $path): ?array
{
    if (!is_file($path) || (time() - (int) filemtime($path)) >= WEATHER_CACHE_TTL) {
        return null;
    }

    $raw = file_get_contents($path);
    if ($raw === false) {
        return null;
    }

    $data = json_decode($raw, true);
    return is_array($data) && ($data["ok"] ?? false) === true ? $data : null;
}

function writeCache(string $path, array $payload): void
{
    $temporary = tempnam(dirname($path), "weather-");
    if ($temporary === false) {
        throw new RuntimeException("Unable to create weather cache file");
    }

    $encoded = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($encoded === false || file_put_contents($temporary, $encoded, LOCK_EX) === false) {
        @unlink($temporary);
        throw new RuntimeException("Unable to write weather cache file");
    }

    @chmod($temporary, 0600);
    if (!@rename($temporary, $path)) {
        @unlink($temporary);
        throw new RuntimeException("Unable to publish weather cache file");
    }
}

function requestWeather(string $apiKey, string $visitorIp): array
{
    $query = http_build_query([
        "key" => $apiKey,
        "q" => $visitorIp,
        "aqi" => "no",
        "lang" => "zh",
    ], "", "&", PHP_QUERY_RFC3986);

    $handle = curl_init(WEATHER_ENDPOINT . "?" . $query);
    if ($handle === false) {
        throw new RuntimeException("Unable to initialize weather request");
    }

    $options = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => WEATHER_CONNECT_TIMEOUT,
        CURLOPT_TIMEOUT => WEATHER_REQUEST_TIMEOUT,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_HTTPHEADER => ["Accept: application/json"],
        CURLOPT_USERAGENT => "FanciVoid-Weather-Proxy/1.0",
    ];

    if (defined("CURLOPT_PROTOCOLS") && defined("CURLPROTO_HTTPS")) {
        $options[CURLOPT_PROTOCOLS] = CURLPROTO_HTTPS;
    }

    curl_setopt_array($handle, $options);
    $body = curl_exec($handle);
    $status = (int) curl_getinfo($handle, CURLINFO_HTTP_CODE);
    curl_close($handle);

    if (!is_string($body) || $status !== 200 || strlen($body) > 1048576) {
        throw new RuntimeException("Weather provider request failed");
    }

    $result = json_decode($body, true);
    if (!is_array($result) || isset($result["error"])) {
        throw new RuntimeException("Weather provider returned an invalid response");
    }

    $location = $result["location"] ?? null;
    $current = $result["current"] ?? null;
    if (!is_array($location) || !is_array($current)) {
        throw new RuntimeException("Weather provider response is incomplete");
    }

    return [
        "ok" => true,
        "source" => "weatherapi",
        "city" => $location["name"] ?? "未知地区",
        "region" => $location["region"] ?? "",
        "country" => $location["country"] ?? "",
        "latitude" => $location["lat"] ?? null,
        "longitude" => $location["lon"] ?? null,
        "timezone" => $location["tz_id"] ?? "",
        "localTime" => $location["localtime"] ?? "",
        "condition" => $current["condition"]["text"] ?? "天气未知",
        "weatherCode" => $current["condition"]["code"] ?? null,
        "temperature" => $current["temp_c"] ?? null,
        "feelsLike" => $current["feelslike_c"] ?? null,
        "windSpeed" => $current["wind_kph"] ?? null,
        "windDirection" => $current["wind_dir"] ?? "",
        "windDegree" => $current["wind_degree"] ?? null,
        "humidity" => $current["humidity"] ?? null,
        "isDay" => $current["is_day"] ?? null,
        "lastUpdated" => $current["last_updated"] ?? "",
    ];
}

if (($_SERVER["REQUEST_METHOD"] ?? "GET") !== "GET") {
    header("Allow: GET");
    sendJson(["ok" => false, "message" => "Method not allowed"], 405);
}

$apiKey = trim((string) getenv("WEATHERAPI_KEY"));
$visitorIp = $_SERVER["REMOTE_ADDR"] ?? "";
if ($apiKey === "" || filter_var($visitorIp, FILTER_VALIDATE_IP) === false) {
    failUnavailable();
}

$cacheDirectory = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR)
    . DIRECTORY_SEPARATOR
    . "fancivoid-weather-cache";

if (!is_dir($cacheDirectory) && !mkdir($cacheDirectory, 0700, true) && !is_dir($cacheDirectory)) {
    failUnavailable();
}

@chmod($cacheDirectory, 0700);
$cacheKey = hash_hmac("sha256", $visitorIp, $apiKey);
$cachePath = $cacheDirectory . DIRECTORY_SEPARATOR . $cacheKey . ".json";

$cached = readFreshCache($cachePath);
if ($cached !== null) {
    sendJson($cached);
}

$lock = fopen($cachePath . ".lock", "c");
if ($lock === false || !flock($lock, LOCK_EX)) {
    if (is_resource($lock)) {
        fclose($lock);
    }
    failUnavailable();
}

try {
    $cached = readFreshCache($cachePath);
    if ($cached !== null) {
        flock($lock, LOCK_UN);
        fclose($lock);
        sendJson($cached);
    }

    $weather = requestWeather($apiKey, $visitorIp);
    writeCache($cachePath, $weather);
    flock($lock, LOCK_UN);
    fclose($lock);
    sendJson($weather);
} catch (Throwable $error) {
    error_log("Weather proxy unavailable: " . $error->getMessage());
    flock($lock, LOCK_UN);
    fclose($lock);
    failUnavailable();
}
