from accountManager import signInOutProcess
from bomManager import uploadBomJsonProcess
from bomManager import reqPartInfoProcess
from accountManager import sidLookup

acceptableActions = ['signIn', 'signOut', 'uploadBomJson', 'reqPartInfo']

def requestProcess(reqJson):
    #unknown action:
    if ('action' not in reqJson) or (reqJson['action'] not in acceptableActions):
        return {'error':'unknown action'}

    if (reqJson['action'] == 'signIn') or (reqJson['action'] == 'signOut'):
        return signInOutProcess(reqJson)

    #need authnetication, if no sid, reject
    if ('sid' not in reqJson):
        return {'error':'missing session id'}

    usrInfo = sidLookup(reqJson['sid'])
    if usrInfo == None:
        return {'error':'invalid session id'}

    if (reqJson['action'] == 'uploadBomJson'):
        return uploadBomJsonProcess(reqJson, usrInfo)

    if (reqJson['action'] == 'reqPartInfo'):
        return reqPartInfoProcess(reqJson, usrInfo)
    return {'error':'unimplemented action'}
