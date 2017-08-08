const nodemailer = require('nodemailer');
const wellknown = require("nodemailer-wellknown");
const smtpTransport = require('nodemailer-smtp-transport');

const DOMAIN_MAPPING: { [domain: string]: any } = {
    'qq.com': 'QQ'
};

export class SmtpClient {

    constructor(private user: string, private pass: string) {

    }

    public send(toMail: string) {

        var smtpTransport = this.createTransport();

        smtpTransport.sendMail({
            from: this.user
            , to: toMail
            , subject: 'Node.JS通过SMTP协议从QQ邮箱发送邮件'
            , html: '这是一封测试邮件 <br> '
        }, function (err, res) {
            console.log(err, res);
        });
    }

    private createTransport() {
        const smtpConfig = this.getSmtpConfig();
        smtpConfig.auth = {
            user: this.user,
            pass: this.pass
        };

        return nodemailer.createTransport(smtpTransport(smtpConfig));
    }

    private getDomain(): string {
        const matchs = /@(.*)$/.exec(this.user);
        if (matchs) {
            return matchs[1].toLocaleLowerCase();
        }

        throw `mail address[${this.user}] is invalid.`;
    }

    private getSmtpConfig(): any {
        const name = DOMAIN_MAPPING[this.getDomain()];
        return wellknown(name);
    }

}