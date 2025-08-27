const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration - Update these variables manually for each project
const PROJECT_CODE = 'ECOM';
const SESSION_DIRECTORY = path.join(os.homedir(), 'sessions');

// Create session directory if it doesn't exist
if (!fs.existsSync(SESSION_DIRECTORY)) {
    fs.mkdirSync(SESSION_DIRECTORY, { recursive: true });
}

// Read the hook payload from stdin
let inputData = '';
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
    let chunk;
    while ((chunk = process.stdin.read()) !== null) {
        inputData += chunk;
    }
});

process.stdin.on('end', () => {
    try {
        if (inputData.trim()) {
            const payload = JSON.parse(inputData);

            // Extract session_id from payload
            const sessionId = payload.session_id;

            if (sessionId) {
                // Create session file with project code and session ID
                const sessionFileName = `${PROJECT_CODE}.txt`;
                const sessionFilePath = path.join(SESSION_DIRECTORY, sessionFileName);
                console.log(sessionFilePath)
                // Write session ID to file
                fs.writeFileSync(sessionFilePath, sessionId);

                console.log(`Session stored: ${sessionId} in ${sessionFilePath}`);
            } else {
                console.log('No session_id found in payload');
            }
        } else {
            console.log('Empty payload received');
        }
    } catch (error) {
        console.error('Error processing payload:', error.message);
        console.log('Raw input was:', inputData);
    }
});