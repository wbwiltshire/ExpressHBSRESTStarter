@ECHO OFF
SET OPENSSL="c:\Program Files\OpenSSL-Win64\bin\openssl.exe"
%OPENSSL% version
SET HOST=scwswbw10
REM Dump the certificate information from the web application running on scwswbw10:port
ECHO Dumping certificate information for server %HOST%
%OPENSSL% s_client -connect %HOST%:5100 -servername %HOST% > certfile.log