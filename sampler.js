const mysql = require('mysql')
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

async function getMsqlConnection() {
    // DefaultAzureCredential expects the following three environment variables:
    // * AZURE_TENANT_ID: The tenant ID in Azure Active Directory
    // * AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
    // * AZURE_CLIENT_SECRET: The client secret for the registered application

    const credential = new DefaultAzureCredential();    
    // Build the URL to reach your key vault
    const vaultName = 'jose-mysqlkv'
    const url = `https://${vaultName}.vault.azure.net`;    
    // Lastly, create our secrets client and connect to the service
    const client = new SecretClient(url, credential);
    const kvHost = await client.getSecret('mysql-host')
    const kvUser = await client.getSecret('mysql-user')
    const kvPwd = await client.getSecret('mysql-password')
    const kvDb = await client.getSecret('mysql-db')

    let config = {
        host: kvHost.value,
        user: kvUser.value,
        password: kvPwd.value,
        database: kvDb.value,
        insecureAuth: true,
        ssl: { rejectUnauthorized: true }
    }

    return mysql.createConnection(config)
}

async function Sampler(req, res) {
    const conn = await getMsqlConnection();
    conn.query('SELECT * FROM demo', function(err, results, fields) {
        if (err) throw err
        res.json(results)
    })

    conn.end()    
}

module.exports = Sampler