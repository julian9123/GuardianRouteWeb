cls
del /s /a:H desktop.ini
cd "C:\Users\JULIAN Corp\Google Drive\NOVATEC\Personal\Apps\Guardian\GuardianRouteWeb\www\js"
xcopy *.js "C:\Users\JULIAN Corp\Google Drive\NOVATEC\Personal\Apps\Guardian\js" /Y
timeout 3
cmd /c uglifyjs --compress --mangle -- cnsClearMap.js >> cnsClearMap.js1
timeout 3
cmd /c uglifyjs --compress --mangle -- conectar.js >> conectar.js1
timeout 3
cmd /c uglifyjs --compress --mangle -- consultar.js >> consultar.js1
timeout 3
cmd /c uglifyjs --compress --mangle -- index.js >> index.js1
timeout 3
cmd /c uglifyjs --compress --mangle -- indicaciones.js >> indicaciones.js1
timeout 3
cmd /c uglifyjs --compress --mangle -- mapas.js >> mapas.js1
timeout 3
cmd /c uglifyjs --compress --mangle -- paises.js >> paises.js1
timeout 3
del *.js
cmd /c ren cnsClearMap.js1 cnsClearMap.js
cmd /c ren conectar.js1 conectar.js
cmd /c ren consultar.js1 consultar.js
cmd /c ren index.js1 index.js
cmd /c ren indicaciones.js1 indicaciones.js
cmd /c ren mapas.js1 mapas.js
cmd /c ren paises.js1 paises.js
cd "C:\Users\JULIAN Corp\Google Drive\NOVATEC\Personal\Apps\Guardian\GuardianRouteWeb"
cmd /c firebase deploy
timeout 3
cd "C:\Users\JULIAN Corp\Google Drive\NOVATEC\Personal\Apps\Guardian\js\"
xcopy *.js "C:\Users\JULIAN Corp\Google Drive\NOVATEC\Personal\Apps\Guardian\GuardianRouteWeb\www\js" /Y
timeout 3
cd "C:\Users\JULIAN Corp\Google Drive\NOVATEC\Personal\Apps\Guardian\GuardianRouteWeb"
rem pause