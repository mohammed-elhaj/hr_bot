import os

def generate_folder_tree(directory):
    """
    Generates a tree-like representation of a directory and its contents.

    Args:
        directory: The path to the directory.

    Returns:
        A string representing the directory tree.
    """

    tree_str = ""
    for root, dirs, files in os.walk(directory):
        level = root.replace(directory, '').count(os.sep)
        indent = ' ' * 4 * level
        tree_str += '{}{}/\n'.format(indent, os.path.basename(root))
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            tree_str += '{}{}\n'.format(subindent, f)

    return tree_str

if __name__ == "__main__":
    folder_path = input("Enter the folder directory: ")

    if os.path.isdir(folder_path):
        tree = generate_folder_tree(folder_path)
        print(tree)
    else:
        print("Invalid directory path.")