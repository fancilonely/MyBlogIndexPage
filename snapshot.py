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


IGNORE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".ico",
    ".svg",
    ".woff",
    ".woff2",
    ".ttf",
    ".mp3",
    ".mp4",
    ".zip",
    ".gz",
}


TEXT_EXTENSIONS = {
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".vue",
    ".css",
    ".scss",
    ".html",
    ".json",
    ".md",
    ".txt",
    ".env",
    ".yml",
    ".yaml",
}


# ==============================
# Folder tree
# ==============================

def generate_tree(root):

    lines = []

    for current_root, dirs, files in os.walk(root):

        dirs[:] = [
            d for d in dirs
            if d not in IGNORE_DIRS
        ]

        level = current_root.replace(root, "").count(os.sep)

        indent = "    " * level

        folder_name = os.path.basename(current_root)

        if level == 0:
            lines.append(folder_name)
        else:
            lines.append(
                f"{indent}├── {folder_name}/"
            )

        for file in files:
            ext = os.path.splitext(file)[1].lower()

            if ext in IGNORE_EXTENSIONS:
                continue

            file_indent = "    " * (level + 1)

            lines.append(
                f"{file_indent}├── {file}"
            )

    return "\n".join(lines)



# ==============================
# Export files
# ==============================

def export_files(root):

    content = []

    for current_root, dirs, files in os.walk(root):

        dirs[:] = [
            d for d in dirs
            if d not in IGNORE_DIRS
        ]

        for file in files:

            ext = os.path.splitext(file)[1].lower()

            if ext in IGNORE_EXTENSIONS:
                continue

            if ext not in TEXT_EXTENSIONS:
                continue


            path = os.path.join(
                current_root,
                file
            )

            relative_path = os.path.relpath(
                path,
                root
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
                    encoding="utf-8"
                ) as f:

                    content.append(
                        f.read()
                    )

            except Exception as e:

                content.append(
                    f"[READ ERROR] {e}"
                )


    return "\n".join(content)



# ==============================
# Main
# ==============================

def main():

    os.makedirs(
        OUTPUT_DIR,
        exist_ok=True
    )


    timestamp = datetime.now().strftime(
        "%Y%m%d_%H%M%S"
    )


    output_file = os.path.join(
        OUTPUT_DIR,
        f"project_snapshot_{timestamp}.txt"
    )


    with open(
        output_file,
        "w",
        encoding="utf-8"
    ) as f:


        f.write(
            "PROJECT SNAPSHOT\n"
        )

        f.write(
            "=" * 80
            + "\n"
        )


        f.write(
            f"Generated Time: "
            f"{datetime.now()}\n"
        )

        f.write(
            f"Project Root: "
            f"{PROJECT_ROOT}\n"
        )


        f.write(
            "\n\n"
            "PROJECT STRUCTURE\n"
        )

        f.write(
            "=" * 80
            + "\n"
        )

        f.write(
            generate_tree(
                PROJECT_ROOT
            )
        )


        f.write(
            "\n\n\n"
            "SOURCE FILE CONTENT\n"
        )

        f.write(
            "=" * 80
            + "\n"
        )


        f.write(
            export_files(
                PROJECT_ROOT
            )
        )


    print(
        "Snapshot generated:"
    )

    print(
        output_file
    )



if __name__ == "__main__":
    main()