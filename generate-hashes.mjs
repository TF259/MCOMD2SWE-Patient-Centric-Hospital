// Generate bcrypt hashes for testing
import bcrypt from 'bcryptjs';

async function generateHashes() {
    const arthurHash = await bcrypt.hash('arthur123', 10);
    const sarahHash = await bcrypt.hash('sarah123', 10);
    
    console.log('Arthur (arthur123):', arthurHash);
    console.log('Sarah (sarah123):', sarahHash);
    
    // Verify the existing hash
    const existingArthurHash = '$2a$10$mCUCHeH84.NfW.lJ9GvSve9XhZq/q0mYl3zZ/fIu8Uj.YwWz6k8.i';
    const isValid = await bcrypt.compare('arthur123', existingArthurHash);
    console.log('Existing Arthur hash is valid:', isValid);
}

generateHashes();
