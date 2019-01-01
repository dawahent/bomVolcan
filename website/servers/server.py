from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import cgi
import json
from requestTaskAssign import requestProcess

class PostHandler(BaseHTTPRequestHandler):

    def do_POST(self):
        # Parse the form data posted
        # self._set_headers()
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST'}
        )

        # Begin the response
        self.send_response(200)
        self.end_headers()
        # self.wfile.write('Client: %s\n' % str(self.client_address))
        # self.wfile.write('User-agent: %s\n' % str(self.headers['user-agent']))
        # self.wfile.write('Path: %s\n' % self.path)
        # self.wfile.write('Form data:\n')

        # Echo back information about what was posted in the form
        # for field in form.keys():
        #     field_item = form[field]
        #     self.wfile.write('\t%s=%s\n' % (field, form[field].value))
        reqJson = json.loads(form.value)
        # print reqJson
        toRespRaw = requestProcess(reqJson)
        toResp = json.dumps(toRespRaw, separators=(',', ':'))
        self.wfile.write(toResp)
        return
if __name__ == '__main__':
    PORT_NUMBER = 8080
    try:
        #Create a web server and define the handler to manage the
        #incoming request
        server = HTTPServer(('', PORT_NUMBER), PostHandler)
        print('Started httpserver on port')
        #Wait forever for incoming htto requests
        server.serve_forever()
    except KeyboardInterrupt:
        print('received, shutting down the web server')
        server.socket.close()
