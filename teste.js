const gdrive = require("./gdrive");

const GOOGLE_API_FOLDER_ID = '1-bD4Zi3QrT7WQWuksphPCCvGPKh2HGv6'   //PEDIDOS SALETE

gdrive.imageUpload("A C Lins 29 04 22 677,00.xlsx", "./A C Lins 29 04 22 677,00.xlsx", GOOGLE_API_FOLDER_ID, (id) => {
    console.log(id);
});
