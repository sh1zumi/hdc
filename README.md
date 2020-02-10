# Hentai Download Client
Scripts that helps you to download books from source and save them to your directory.

## Why should I need this?
**nhentai** offers torrent as the only mean for downloading book, which is not convenient and efficient.

## Environment
Node.js 12+

## Usage
```
node index.js download <bookIDs> [-d save_dir]
```

### Options
The options will alter the behavior of downloading and saving.

### bookIDs
You can download multiple books by leaving space between each book ID. 
```
node index.js download 269972 300910
```

### destination (-d)
Override the save directory, which by default is the current directory of the project.
```
node index.js download 269972 -d ./books
```
