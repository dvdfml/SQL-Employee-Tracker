import { Console } from 'console';
import { Transform } from 'stream'

export const table = (array) => {

    const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } });
    const logger = new Console({ stdout: ts });

    logger.table(array);
    const table = (ts.read() || '').toString();
    let result = '';
    let rows = table.split(/[\r\n]+/);
    // remove first and last rows
    rows.splice(0, 1);
    rows.pop();
    rows.pop();

    for (let row of rows) {
        // remove index column
        let r = row.replace(/[^┬]*┬/, '┌');
        r = r.replace(/^├─*┼/, '├');
        r = r.replace(/│[^│]*/, '');
        r = r.replace(/^└─*┴/, '└');
        // remove '' characters
        r = r.replace(/\s'/g, ' ');
        r = r.replace(/'/g, '  ');
        // remove - characters
        r = r.replace(/─/g, '—');
        r = r.replace(/(?<!—)—/g, ' ');
        r = r.replace(/—(?!—)/g, ' ');
        // remove lines
        r = r.replace(/[├┼┤│]/g, ' ');
        result += `${r}\n`;
    };
    console.log(`\n${result}`);
}
