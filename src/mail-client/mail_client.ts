import { getMailConfig, MailConfig } from './get_mail_config';
import * as fs from 'fs';

const nodemailer = require('nodemailer');
const wellknown = require("nodemailer-wellknown");
const smtpTransport = require('nodemailer-smtp-transport');
const Imap = require('imap');
const inspect = require('util').inspect;

const DOMAIN_MAPPING: { [domain: string]: any } = {
    'qq.com': 'QQ'
};



export interface SmtpConfig {
    host: string,
    port: number,
    secure: boolean,
    auth: {
        user: string,
        pass: string
    }
}

export interface ImapConfig {
    user: string,
    password: string,
    host: string,
    port: number,
    tls: boolean
}

export interface SendMailRequest {
    from?: string,
    to: string,
    digest: {
        name: string,
        description?: string,
        format?: string,
        size?: number,
        author?: string
    },
    attachment: any
}

export class MailClient {

    constructor(private user: string, private pass: string) {
    }

    public sendMail(sendMailRequest: SendMailRequest) {
        return new Promise((resolve, reject) => {
            const smtpTransport = this.createTransport();
            smtpTransport.sendMail({
                envelope: {
                    from: sendMailRequest.from || this.user, // used as MAIL FROM: address for SMTP
                    to: sendMailRequest.to
                },
                subject: `[kindle]${sendMailRequest.digest.name}`,
                html: JSON.stringify(sendMailRequest.digest, null, 4),
                attachments: [{
                    filename: 'book.zip',
                    content: sendMailRequest.attachment
                }]
            }, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        })
    }

    public createTransport() {
        const mailConfig: MailConfig | undefined = getMailConfig(this.user);
        if (mailConfig) {
            const smtpConfig = mailConfig.smtp;
            smtpConfig.auth = { user: this.user, pass: this.pass };
            return nodemailer.createTransport(smtpTransport(smtpConfig));
        } else {
            throw `can not find smtp config for ${this.user}.`;
        }
    }

    public queryBookList() {

        return new Promise((resolve, reject) => {
            const mailConfig: MailConfig | undefined = getMailConfig(this.user);
            if (!mailConfig) {
                throw `can not find imap config for ${this.user}.`;
            }
            const imapConfig = mailConfig.imap;
            imapConfig.user = this.user;
            imapConfig.password = this.pass;

            const imap = new Imap(imapConfig);

            const openInbox = (cb) => {
                imap.openBox('SENTBOX', true, cb);
            }

            imap.once('ready', function () {
                openInbox(function (err, box) {
                    if (err) throw err;
                    imap.search(['UNSEEN', ['SINCE', 'May 20, 2010']], function (err, results) {
                        if (err) throw err;
                        var f = imap.fetch(results, { bodies: '' });
                        f.on('message', function (msg, seqno) {
                            console.log('Message #%d', seqno);
                            var prefix = '(#' + seqno + ') ';
                            msg.on('body', function (stream, info) {
                                console.log(prefix + 'Body');
                                stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
                            });
                            msg.once('attributes', function (attrs) {
                                console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                            });
                            msg.once('end', function () {
                                console.log(prefix + 'Finished');
                            });
                        });
                        f.once('error', function (err) {
                            console.log('Fetch error: ' + err);
                        });
                        f.once('end', function () {
                            console.log('Done fetching all messages!');
                            imap.end();
                        });
                    });
                });
            });
        });
    }

}