def checkJson(reqJson, toMatch):
    if toMatch == 'signInOutProcess':
        return ('username' in reqJson) and ('password' in reqJson)

    if toMatch == 'uploadBomJsonProcess':
        return ('partInfoSet' in reqJson) and ('productInfo' in reqJson)

    if toMatch == 'reqPartInfoProcess':
        return ('query' in reqJson) and ('queryBy' in reqJson)

    return False
