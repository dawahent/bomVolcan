import pymongo
from pymongo import MongoClient
from reqJsonVerification import checkJson
import string
import random

client = MongoClient('localhost', 27017)
db = client['volcan']
accountCol = db['account']
sessionTable = db['session']

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def signInOutProcess(reqJson):
    if not checkJson(reqJson, 'signInOutProcess'):
        return {'error':'field values not complete'}

    if reqJson['action'] == 'signIn':
        return signIn(reqJson)
    else:
        return {'error': 'NOIMP'}

def signIn(reqJson):
    #assume json has enough info
    queryResp = accountCol.find_one({'username' : reqJson['username'], 'password': reqJson['password']})
    if queryResp == None:
        return {'error':'unmatched or missing credentials'}

    #login sucessful, assigning session id

    #generat new sid until no collisions
    sid = id_generator(10)
    while sidLookup(sid) != None:
        sid = id_generator(10)

    sessionTable.insert({'sid': sid, 'username' : queryResp['username'],
    'uid' : queryResp['_id'], 'level' : queryResp['level']})
    return {'sid': sid}

def sidLookup(sid):
    return sessionTable.find_one({'sid':sid})
