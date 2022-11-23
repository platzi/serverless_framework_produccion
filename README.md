# serverless-framework


# creacion de paquetes de layers en local
### NOTA: si usas ARM M1 y quieres desplegar este codigo desde tu maquina local usa los argumentos --arch y --platform
npm install --production --arch=x64 --platform=linux
o
npm install --production
mkdir nodejs
mv node_modules nodejs
apt update -y && apt install zip -y # Instalacion de zip en caso de que no lo tengas instalado
zip -r nodejs.zip nodejs/

# creacion de layers usando un zip

aws lambda publish-layer-version --layer-name my-first-layer --description "My first layer" \
--license-info "MIT" \
--zip-file fileb://nodejs.zip

#