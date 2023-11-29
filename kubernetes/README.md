## Build instructions

* The kubernetes manifests are created through kompose by converting the docker-compose file.
```bash
cd kubernetes
kompose convert -f ../docker-compose.yml
```