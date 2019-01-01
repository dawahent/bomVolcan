
from reqJsonVerification import checkJson
import pymongo
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client['volcan']
productCol = db['product']
partCol = db['part']

def uploadBomJsonProcess(reqJson, usrInfo):
    if not checkJson(reqJson, 'uploadBomJsonProcess'):
        return {'error':'field values not complete'}

    #id and _id are different, id is set by user while _id is auto-assigned by mongodb
    #lookup product by id to see already uploaded
    if productCol.find_one({'Product Item Id': reqJson['productInfo']['Product Item Id']}) != None:
        return {'error':'Product Item Id '+reqJson['productInfo']['Product Item Id']+ ' is already in database'}

    #lookup parts by all id to see if duplicated
    dupPart = []
    for part in reqJson['partInfoSet']:
        if partCol.find_one({'Part Number': part['Part Number']}) != None:
            dupPart.append(part['Part Number'])
    if len(dupPart) != 0:
        return {'error':'Part Number ' + ', '.join(dupPart) + ' is already in database'}

    #insert product with specifying its uploader's _id,
    reqJson['productInfo']['uploader'] = usrInfo['_id']
    productInserted_id = productCol.insert(reqJson['productInfo'])
    #insert all parts with with specifying product _id and qty in belong array, and note down their _id
    partsInsertedId = []
    for part in reqJson['partInfoSet']:
        part['belong'] = [(productInserted_id, part['Q\'ty/Set'])]
        part['uploader'] = usrInfo['_id']
        #remove qty from part before insertion
        _ = part.pop('Q\'ty/Set', None)
        partsInsertedId.append((partCol.insert(part)))

    #update parts' id to product
    productCol.update_one({'_id': productInserted_id}, {"$set" : {'parts_id' : partsInsertedId}})
    #return success msg

    return {'message' : 'upload successful'}

def reqPartInfoProcess(reqJson, usrInfo):
    if not checkJson(reqJson, 'reqPartInfoProcess'):
        return {'error':'field values not complete'}

    #init respJson
    respJson = dict()

    #find the parts first
    respJson['partInfoSet'] = list(partCol.find({ reqJson['queryBy'] : {"$in": reqJson['query']}}))

    #find all product those parts belonged to
    productToQuery = set()
    for js in respJson['partInfoSet']:
        for (product_id, _) in js['belong']:
            productToQuery.add(product_id)
        #convert Objectid to str
        js['belong'] = map(lambda (x,y): (str(x), y), js['belong'])
        js['_id'] = str(js['_id'])
        js['uploader'] = str(js['uploader'])

    respJson['productSet'] = list(productCol.find({ '_id' : {"$in": list(productToQuery)}}))
    #convert Objectid to str
    for js in respJson['productSet']:
        js['_id'] = str(js['_id'])
        js['uploader'] = str(js['uploader'])
        js['parts_id'] = map(lambda x: str(x), js['parts_id'])

    #return the whole json
    print respJson
    return respJson
