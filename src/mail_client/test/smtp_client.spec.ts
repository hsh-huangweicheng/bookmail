import { SmtpClient } from './../smtp_client';
import { expect } from 'chai';
import 'mocha';

describe('Hello function', () => {

    const dataList = [
        { mail: 'xx@qq.com', name: 'qq.com' },
        { mail: 'xx@QQ.com', name: 'qq.com' }
    ];

    dataList.forEach(({ mail, name }: { mail: string, name: string }) => {
        it(`mail[${mail}]'s site name is ${name}`, () => {
            const client = new SmtpClient(mail, '');
            expect(client['getDomain']()).to.equal(name);
        });
    });

    it('verify smtpTransport', (done) => {
        const client = new SmtpClient('xx@qq.com', 'xx');
        const smtpTransport = client['createTransport']();
        smtpTransport.verify((error, success) => {
            expect(error).to.null;
            done();
        });
    });

});