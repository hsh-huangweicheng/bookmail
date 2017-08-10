const MailInfo = {
    '139.com': {
        smtp: {
            host: "smtp.139.com",
            port: 25,
            secure: false
        },
        imap: {
            host: 'imap.139.com',
            port: '143',
            tls: false
        }
    }
}

export interface MailConfig {
    smtp: {
        auth: {
            user: string,
            pass: string
        }
    },
    imap: {
        user: string,
        password: string
    }
};

export const getMailConfig = (user: string): MailConfig | undefined => {
    const matchs = /@(.*)$/.exec(user);
    if (matchs && MailInfo[matchs[1]]) {
        return JSON.parse(JSON.stringify(MailInfo[matchs[1]]));
    }
};