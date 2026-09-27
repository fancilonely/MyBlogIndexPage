import os
from datetime import datetime


# ==============================
# Configuration
# ==============================

PROJECT_ROOT = os.path.dirname(
    os.path.abspath(__file__)
)

OUTPUT_DIR = os.path.join(
    PROJECT_ROOT,
    "txt",
)

IGNORE_DIRS = {
    "node_modules",
    "dist",
    ".git",
    ".idea",
    ".vscode",
    "txt",
}

# 现在同时扫描 Vue 和 JavaScript
TARGET_EXTENSIONS = {
    ".vue",
    ".js",
}


# ==============================
# Helpers
# ==============================

def is_target_file(filename):
    extension = os.path.splitext(
        filename
    )[1].lower()

    return extension in TARGET_EXTENSIONS


def contains_target_files(directory):
    """
    判断一个目录及其子目录中
    是否存在 .vue / .js 文件。

    只用于生成精简目录树。
    """

    for current_root, dirs, files in os.walk(
        directory
    ):
        dirs[:] = sorted(
            directory_name
            for directory_name in dirs
            if directory_name not in IGNORE_DIRS
        )

        if any(
            is_target_file(filename)
            for filename in files
        ):
            return True

    return False


def normalize_path(path):
    """
    snapshot 中统一使用 /
    避免 Windows 路径出现大量反斜杠。
    """

    return path.replace(
        os.sep,
        "/",
    )


# ==============================
# Folder tree
# ==============================

def generate_tree(root):
    lines = [
        os.path.basename(root)
    ]

    for current_root, dirs, files in os.walk(
        root
    ):
        # 只保留：
        # 1. 非忽略目录
        # 2. 内部确实存在目标文件的目录
        dirs[:] = sorted(
            directory_name
            for directory_name in dirs
            if (
                directory_name
                not in IGNORE_DIRS
                and contains_target_files(
                    os.path.join(
                        current_root,
                        directory_name,
                    )
                )
            )
        )

        level = os.path.relpath(
            current_root,
            root,
        ).count(os.sep)

        # root 自己特殊处理
        if current_root == root:
            level = 0
        else:
            level += 1

        if current_root != root:
            folder_indent = (
                "    " * (level - 1)
            )

            folder_name = os.path.basename(
                current_root
            )

            lines.append(
                f"{folder_indent}"
                f"├── {folder_name}/"
            )

        target_files = sorted(
            filename
            for filename in files
            if is_target_file(filename)
        )

        file_indent = (
            "    " * level
        )

        for filename in target_files:
            lines.append(
                f"{file_indent}"
                f"├── {filename}"
            )

    return "\n".join(lines)


# ==============================
# Export source files
# ==============================

def export_files(root):
    content = []

    target_paths = []

    # 先统一收集所有目标文件
    for current_root, dirs, files in os.walk(
        root
    ):
        dirs[:] = sorted(
            directory_name
            for directory_name in dirs
            if directory_name not in IGNORE_DIRS
        )

        for filename in files:
            if not is_target_file(
                filename
            ):
                continue

            path = os.path.join(
                current_root,
                filename,
            )

            target_paths.append(
                path
            )

    # 保证每次 snapshot 顺序稳定
    target_paths.sort(
        key=lambda path:
        normalize_path(
            os.path.relpath(
                path,
                root,
            )
        ).lower()
    )

    for path in target_paths:
        relative_path = normalize_path(
            os.path.relpath(
                path,
                root,
            )
        )

        content.append(
            "\n\n"
            + "=" * 80
            + "\n"
            + f"FILE: {relative_path}\n"
            + "=" * 80
            + "\n"
        )

        try:
            with open(
                path,
                "r",
                encoding="utf-8",
            ) as file:
                content.append(
                    file.read()
                )

        except UnicodeDecodeError:
            try:
                with open(
                    path,
                    "r",
                    encoding="utf-8-sig",
                ) as file:
                    content.append(
                        file.read()
                    )

            except Exception as error:
                content.append(
                    "[READ ERROR] "
                    f"{error}"
                )

        except Exception as error:
            content.append(
                "[READ ERROR] "
                f"{error}"
            )

    return "\n".join(content)


# ==============================
# Statistics
# ==============================

def count_target_files(root):
    counts = {
        ".vue": 0,
        ".js": 0,
    }

    for current_root, dirs, files in os.walk(
        root
    ):
        dirs[:] = [
            directory_name
            for directory_name in dirs
            if directory_name not in IGNORE_DIRS
        ]

        for filename in files:
            extension = os.path.splitext(
                filename
            )[1].lower()

            if extension in counts:
                counts[extension] += 1

    return counts


# ==============================
# Main
# ==============================

def main():
    os.makedirs(
        OUTPUT_DIR,
        exist_ok=True,
    )

    timestamp = datetime.now().strftime(
        "%Y%m%d_%H%M%S"
    )

    output_file = os.path.join(
        OUTPUT_DIR,
        f"project_snapshot_{timestamp}.txt",
    )

    counts = count_target_files(
        PROJECT_ROOT
    )

    with open(
        output_file,
        "w",
        encoding="utf-8",
    ) as file:
        file.write(
            "VUE + JAVASCRIPT PROJECT SNAPSHOT\n"
        )

        file.write(
            "=" * 80 + "\n"
        )

        file.write(
            f"Generated Time: "
            f"{datetime.now()}\n"
        )

        file.write(
            f"Project Root: "
            f"{PROJECT_ROOT}\n"
        )

        file.write(
            "\nIncluded Extensions:\n"
        )

        file.write(
            "  - .vue\n"
        )

        file.write(
            "  - .js\n"
        )

        file.write(
            "\nFile Count:\n"
        )

        file.write(
            f"  Vue: "
            f"{counts['.vue']}\n"
        )

        file.write(
            f"  JavaScript: "
            f"{counts['.js']}\n"
        )

        file.write(
            f"  Total: "
            f"{sum(counts.values())}\n"
        )

        file.write(
            "\n\nPROJECT FILE STRUCTURE\n"
        )

        file.write(
            "=" * 80 + "\n"
        )

        file.write(
            generate_tree(
                PROJECT_ROOT
            )
        )

        file.write(
            "\n\n\nPROJECT FILE CONTENT\n"
        )

        file.write(
            "=" * 80 + "\n"
        )

        file.write(
            export_files(
                PROJECT_ROOT
            )
        )

    print()
    print(
        "Project snapshot generated:"
    )

    print(
        output_file
    )

    print()

    print(
        f"Vue files: "
        f"{counts['.vue']}"
    )

    print(
        f"JavaScript files: "
        f"{counts['.js']}"
    )

    print(
        f"Total files: "
        f"{sum(counts.values())}"
    )


if __name__ == "__main__":
    main()