var Imap = require('imap');
var inspect = require('util').inspect;
var Mailparser = require('mailparser').MailParser;
var fs = require('fs');


var imap = new Imap({
    user: '13952043725@139.com',
    password: 'hwc13952043725',
    host: 'imap.139.com',
    port: '143',
    tls: false
});

function openInbox(cb) {
    imap.openBox('OUTBOX', true, cb);
}

imap.once('ready', function () {
    imap.openBox('已发送', (err, mailBox) => {
        console.log(mailBox.messages);
        var f = imap.seq.fetch('*', {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            struct: true
        });

        f.on('message', function (msg, seqno) {
            console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function (stream, info) {
                var buffer = '';
                stream.on('data', function (chunk) {
                    buffer += chunk.toString('utf8');
                });
                stream.once('end', function () {
                    console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                });
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

imap.once('error', function (err) {
    console.log(err);
});

imap.once('end', function () {
    console.log('Connection ended');
});

imap.connect();