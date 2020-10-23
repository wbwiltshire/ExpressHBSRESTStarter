@ECHO OFF
SET OPENSSL="c:\Program Files\OpenSSL-Win64\bin\openssl.exe"
%OPENSSL% version
SET HOST=scwswbw10

REM Create Root Certificate Authority private key, if it doesn't exist
SET CAKEYFILE=scwswbw10ca-key
IF EXIST %CAKEYFILE%.pem (
	ECHO Using existing CA key file
) ELSE (
	@ECHO ON
	ECHO Creating Root CA private key %CAKEYFILE%.pem
	%OPENSSL% genrsa -out %CAKEYFILE%.pem 2048
)

@ECHO OFF
REM Self-sign your Root Certificate Authority
SET CACERTFILE=scwswbw10ca-cert
ECHO,
ECHO Creating Root CA Certificate %CACERTFILE%.pem
@ECHO ON
%OPENSSL% req -x509 -new -nodes -key %CAKEYFILE%.pem -days 3650 -out %CACERTFILE%.pem -subj "/C=US/ST=Florida/L=Tampa/O=Self-Signed Authority/CN=scwswbw10"

@ECHO OFF
REM Verify Root Certificate Authority certificate
%OPENSSL% x509 -noout -text -in %CACERTFILE%.pem > %CACERTFILE%-verify.txt

@ECHO OFF
REM Create Server private key, if it doesn't exist
ECHO,
SET KEYFILE=serverkey
IF EXIST %KEYFILE%.pem (
	ECHO Using existing server key file %KEYFILE%.pem
) ELSE (
	@ECHO ON
	ECHO Creating Server private key %KEYFILE%.pem
	%OPENSSL% genrsa -out %KEYFILE%.pem 2048
)

@ECHO OFF
REM Create Server Certificate Signing Request
ECHO,
SET CSRFILE=server
ECHO Creating server CSR file %CSRFILE%.csr
@ECHO ON
%OPENSSL% req -new -key %KEYFILE%.pem -out %CSRFILE%.csr -subj "/C=US/ST=Florida/L=Tampa/O=Seagull Consulting, Inc./CN=scwswbw10"

@ECHO OFF
REM Verify the Server CSR
%OPENSSL% req -noout -text -in %CSRFILE%.csr > %CSRFILE%-csr-verify.txt

@ECHO OFF
REM Sign the CSR with the CA
ECHO,
SET CERTFILE=servercert
ECHO Creating server certificate %CERTFILE%.pem
@ECHO ON
%OPENSSL% x509 -req -in %CSRFILE%.csr -CA %CACERTFILE%.pem -CAkey %CAKEYFILE%.pem -CAcreateserial -out %CERTFILE%.pem -days 3650 -sha256 -extensions v3_req -extfile .\scwswbw10.cfg

@ECHO OFF
REM Verify the Server certificate
%OPENSSL% x509 -noout -text -in %CERTFILE%.pem > %CERTFILE%-verify.txt


















