import os
from datetime import datetime


# ==============================
# Configuration
# ==============================

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

OUTPUT_DIR = os.path.join(PROJECT_ROOT, "txt")

IGNORE_DIRS = {
    "node_modules",
    "dist",
    ".git",
    ".idea",
    ".vscode",
    "txt",
}

TARGET_EXTENSION = ".vue"


# ==============================
# Helpers
# ==============================

def is_vue_file(filename):
    return os.path.splitext(filename)[1].lower() == TARGET_EXTENSION


def contains_vue_files(directory):
    for current_root, dirs, files in os.walk(directory):
        dirs[:] = [
            directory_name
            for directory_name in dirs
            if directory_name not in IGNORE_DIRS
        ]

        if any(is_vue_file(filename) for filename in files):
            return True

    return False


# ==============================
# Folder tree
# ==============================

def generate_tree(root):
    lines = [os.path.basename(root)]

    for current_root, dirs, files in os.walk(root):
        dirs[:] = [
            directory_name
            for directory_name in dirs
            if directory_name not in IGNORE_DIRS
            and contains_vue_files(
                os.path.join(current_root, directory_name)
            )
        ]

        level = current_root.replace(root, "").count(os.sep)
        indent = "    " * level

        if level > 0:
            folder_name = os.path.basename(current_root)
            lines.append(f"{indent}├── {folder_name}/")

        vue_files = sorted(
            filename
            for filename in files
            if is_vue_file(filename)
        )

        file_indent = "    " * (level + 1)

        for filename in vue_files:
            lines.append(f"{file_indent}├── {filename}")

    return "\n".join(lines)


# ==============================
# Export Vue files
# ==============================

def export_files(root):
    content = []

    for current_root, dirs, files in os.walk(root):
        dirs[:] = [
            directory_name
            for directory_name in dirs
            if directory_name not in IGNORE_DIRS
        ]

        vue_files = sorted(
            filename
            for filename in files
            if is_vue_file(filename)
        )

        for filename in vue_files:
            path = os.path.join(current_root, filename)
            relative_path = os.path.relpath(path, root)

            content.append(
                "\n\n"
                + "=" * 80
                + "\n"
                + f"FILE: {relative_path}\n"
                + "=" * 80
                + "\n"
            )

            try:
                with open(path, "r", encoding="utf-8") as file:
                    content.append(file.read())

            except Exception as error:
                content.append(f"[READ ERROR] {error}")

    return "\n".join(content)


# ==============================
# Main
# ==============================

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    output_file = os.path.join(
        OUTPUT_DIR,
        f"vue_snapshot_{timestamp}.txt",
    )

    with open(output_file, "w", encoding="utf-8") as file:
        file.write("VUE PROJECT SNAPSHOT\n")
        file.write("=" * 80 + "\n")

        file.write(f"Generated Time: {datetime.now()}\n")
        file.write(f"Project Root: {PROJECT_ROOT}\n")

        file.write("\n\nVUE FILE STRUCTURE\n")
        file.write("=" * 80 + "\n")
        file.write(generate_tree(PROJECT_ROOT))

        file.write("\n\n\nVUE FILE CONTENT\n")
        file.write("=" * 80 + "\n")
        file.write(export_files(PROJECT_ROOT))

    print("Vue snapshot generated:")
    print(output_file)


if __name__ == "__main__":
    main()