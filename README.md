# servermemo2

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

An alternative version of [servermemo](https://github.com/code4fukui/servermemo). This project provides a simple web-based memo application with end-to-end encryption for saving notes to a server.

## How It Works

The system uses a client-server model with public-key cryptography for security.

-   **Key Generation**: Both the server and the client (your browser) have their own public/private key pairs.
    -   The server's keys are generated once and stored in a `.env` file.
    -   The client's keys are generated on first visit and stored in the browser's `localStorage`.
-   **Encryption**: When you save a memo, the client uses your private key and the server's public key to create a shared secret (via ECDH). It then encrypts your memo with this secret (via AES) before sending it.
-   **Decryption & Storage**: The server receives the encrypted data. It computes the same shared secret using its private key and your public key, decrypts the memo, and saves the **plaintext** content to a file on its disk.
-   **Retrieval**: Memos are stored in a publicly served directory, organized by the client's public key. The "load" button fetches the plaintext memo directly from this location.

## Requirements

-   [Deno](https://deno.land/)

## Setup and Usage

### 1. Generate Server Keys

First, generate the server's public and private keys. This command creates a `.env` file in the project root.

```sh
deno run -A makekeys.js
```

### 2. Configure the Client

You must provide the server's public key to the web client.

1.  Copy the `PUBKEY` value from the newly created `.env` file.
2.  Open `static/index.html` in a text editor.
3.  Find this line:
    ```javascript
    const remotepubkey = Base64URL.decode("xsPBu65X8dscFjUIqECDjT1VcNHwa3GNx2PGkd6d-JA");
    ```
4.  Replace the hardcoded key string with the `PUBKEY` you copied from `.env`.

### 3. Run the Server

Start the server on port 8888 (or any port you choose).

```sh
deno run --allow-net --allow-read --allow-write --allow-env servermemo2.js 8888
```

### 4. Use the Web App

Open [http://localhost:8888/](http://localhost:8888/) in your browser.

-   **Save/Load**: Use the "save on server" and "load from server" buttons to manage your memo.
-   **Manage Keys**: The buttons under the horizontal rule allow you to export, import, or regenerate your client-side (browser) private key. This is useful for using the same memo across different browsers.

## File Structure & API

-   **API Endpoint**: `POST /api/{server_public_key_base64url}/{filename}`
    -   The client sends a CBOR-encoded payload containing its public key and the encrypted memo data.
-   **Data Storage**: The server saves decrypted, plaintext memos to `static/data/{client_public_key_base64url}/{filename}`.
    -   This `static/data` directory is served publicly, allowing the client to fetch the memo directly.

## Related

-   [servermemo](https://github.com/code4fukui/servermemo)
-   [sec.js](https://github.com/code4fukui/sec.js/)

## License

MIT License