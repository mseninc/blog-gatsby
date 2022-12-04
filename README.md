## MSeeeeN Gatsby blog generator

[MSeeeeN](https://mseeeen.msen.jp/) を生成するためのサイトジェネレーターです。

コンテンツは https://github.com/mseninc/blog で管理しています。

### Package Update

Use `npm-check-updates` to update `package.json`.

```
$ npx npm-check-updates -u
$ rm -rf .cache/ public/ node_modules/
$ npm i
```

## Docker image for local preview

### Build Docker image

```
$ sudo docker build . -t <TAG_NAME>
```

- `sudo` required on WSL to avoid error `failed to solve with frontend dockerfile.v0: failed to create LLB definition: rpc error: code = Unknown desc = error getting credentials - err: exit status 255, out:`

- The image is automatically published to `ghcr.io` by a GitHub action. Refer to [blog-gatsby/docker-publish.yml](https://github.com/mseninc/blog-gatsby/blob/main/.github/workflows/docker-publish.yml).

### Run docker container

```
$ docker run -d --name <CONTAINER_NAME> -v $PWD/content:/content -p 8000:8000 <TAG_NAME>
```
