// Convert 2D array to CSV file
export default function CsvWriter(del, enc) {
    this.del = del || ',';
    this.enc = enc || '"';

    this.escapeCol = (col) => {
        if(isNaN(col)) {
            if(!col) {
                col = '';
            } else {
                col = String(col);
                if(col.length > 0) {
                    // Use regex to check for \n ??

                    col = col.split(this.enc).join(this.enc + this.enc);
                    col = this.enc + col + this.enc;
                }
            }
        }
        return col;
    };

    this.arrayToRow = (arr) => {
        let arr2 = arr.slice(0);
        let i, ii = arr2.length;
        for(i = 0; i < ii; i++) {
            arr2[i] = this.escapeCol(arr2[i]);
        }
        return arr2.join(this.del);
    };

    this.arrayToCSVString = (arr) => {
        let arr2 = arr.slice(0);
        arr2.unshift(['FIELDNAME', 'NAME', 'PAGE']); // COLUMN TITLES
        let i, ii = arr2.length;
        for(i = 0; i < ii; i++) {
            arr2[i] = this.arrayToRow(arr2[i]);
        }
        return arr2.join("\r\n");
    };

    this.downloadCSV = (arr) => {
        let csvContent = this.arrayToCSVString(arr);
        csvContent = "data:text/csv;charset=utf-8," + csvContent;
        let encoded = encodeURI(csvContent);
        let link = document.createElement('a');
        link.setAttribute('href', encoded);
        link.setAttribute('download', 'etouchesQuestions.csv');
        document.body.appendChild(link);
        link.click();
    };
}