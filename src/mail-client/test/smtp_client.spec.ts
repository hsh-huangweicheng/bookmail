import { MailClient, SendMailRequest } from './../mail_client';
import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import 'mocha';

const config: {
    user: string,
    pass: string
} = require('../../../config.json');



describe('mail client', () => {

    let mailClient: MailClient;

    beforeEach(() => {
        mailClient = new MailClient(config.user, config.pass);
    });

    it('verify mail', (done) => {
        mailClient.createTransport().verify((error) => {
            expect(error).is.null;
            done();
        });
    });

    xit('send mail', (done) => {
        const req: SendMailRequest = {
            to: config.user,
            digest: {
                name: '全球高等教育中心'
            },
            attachment: fs.readFileSync('./test.zip')
        };
        mailClient.sendMail(req).then(() => {
            done();
        }, (err) => {
            expect(err).is.null;
            done();
        });
    });

    xit('queryBookList', (done) => {
        mailClient.queryBookList().then(done, done);
    });
});