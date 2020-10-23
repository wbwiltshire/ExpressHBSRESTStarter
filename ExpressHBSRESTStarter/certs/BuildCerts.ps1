#Main Process
$ElapsedTime = [System.Diagnostics.Stopwatch]::StartNew()
Write-Host "Script Started at $(get-date)"
$OPENSSL="c:\Program Files\OpenSSL-Win64\bin\openssl.exe"
$server="scwswbw10"

Write-Host
& $OPENSSL version
Write-Host

# Create Root Certificate Authority private key, if it doesn't exist
$caKeyFile="scwswbw10ca-key"
If (Test-Path -Path .\$($caKeyFile).pem -PathType Leaf) {
	Write-Host "Using existing CA key file $($caKeyFile).pem"
} 
Else {
	& $OPENSSL genrsa -out "$($caKeyFile).pem" 2048
}

# Self-sign your Root Certificate Authority
$caCertFile="scwswbw10ca-cert"
Write-Host
Write-Host "Creating Root CA Certificate $($caCertFile).pem"
& $OPENSSL req -x509 -new -nodes -key .\$($caKeyFile).pem -days 3650 -out "$($caCertFile).pem" -subj "/C=US/ST=Florida/L=Tampa/O=Self-Signed Authority/CN=scwswbw10"

# Verify Root Certificate Authority certificate
& $OPENSSL x509 -noout -text -in .\$($caCertFile).pem > "$($caCertFile)-verify.txt"

# Create Server private key, if it doesn't exist
$keyFile="serverkey"
Write-Host
If (Test-Path -Path .\$($keyFile).pem -PathType Leaf) {
	Write-Host "Using existing server key file $($keyFile).pem"
}
Else {
	& $OPENSSL genrsa -out "$($keyFile).pem" 2048
}

# Create Server Certificate Signing Request
$csrFile="server"
Write-Host
Write-Host "Creating server CSR file $($csrFile).csr"
& $OPENSSL req -new -key ".\$($keyFile).pem" -out "$($csrFile).csr" -subj "/C=US/ST=Florida/L=Tampa/O=Seagull Consulting, Inc./CN=scwswbw10"

# Verify Server CSR
& $OPENSSL req -noout -text -in .\$($csrFile).csr > "$($csrFile)-csr-verify.txt"

# Sign the CSR with the CA
$certFile="servercert"
Write-Host
Write-Host "Creating server certificate $($certFile).pem"
& $OPENSSL x509 -req -in .\$($csrFile).csr -CA .\$($caCertFile).pem -CAkey .\$($caKeyFile).pem -CAcreateserial -out "$($certFile).pem" -days 3650 -sha256 -extensions v3_req -extfile .\scwswbw10.cfg

# Verify Server certificate
& $OPENSSL x509 -noout -text -in .\$($certFile).pem > "$($certFile)-verify.txt"

Write-Host "Done"
Write-Host "Script Ended at $(get-date)"
Write-Host "Total Elapsed Time: $($ElapsedTime.Elapsed.ToString())"