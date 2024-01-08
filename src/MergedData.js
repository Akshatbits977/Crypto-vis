const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SystemDetailsSchema = new Schema({
    OS: String,
    kernelVersion: String,
    hostName: String,
    systemType: String,
    numCores: Number,
    RAM_MB: Number
});

const MetadataSchema = new Schema({
    Kernel_Version: String,
    _Power_and_Performance_Mode: String,
    SMT_Mode: String,
    machine: String,
    Node_name: String,
    Architecture: String,
    Byte_Order: String,
    OS: String,
    Number_of_Threads: String,
    nss_version: String,
    Openssl: String,
    Libgcrypt: String,
    nettleversion: String,
    collectionDate: String
});

const CipherSchema = new Schema({
    LibraryName: String,
    CipherName: { type: String, required: false },
    Type: { type: String, required: false },
    MessageSize: { type: String, required: false },
    Value: Number,
    Unit: String
});

const LibrarySchema = new Schema({
    LibraryName: String,
    Ciphers: [CipherSchema]
});

const MergedDataSchema = new Schema({
    collectionDate: Date,
    systemDetails: SystemDetailsSchema,
    metadata: MetadataSchema,
    library: [LibrarySchema]
});

const MergedData = mongoose.model('MergedData', MergedDataSchema, 'merged');

module.exports = MergedData;

