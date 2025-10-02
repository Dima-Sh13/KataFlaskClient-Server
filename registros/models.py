from registros.conexion import Conexion

def select_all():
    conect = Conexion("SELECT * from movement ORDER By id DESC;")
    filas = conect.res.fetchall()#datos de columnas (2025-09-01, Nomina,1800),(2025-09-05,Mercado,-100)
    columnas = conect.res.description#nombre de columnas en las primeras filas (id,0000),(date,000)

    lista_diccionario= []
    
    for f in filas:
        posicion = 0
        diccionario = {}
        for c in columnas:
            diccionario[c[0]] =  f[posicion]
            posicion+=1
        lista_diccionario.append(diccionario)

    conect.con.close()
    
    return lista_diccionario

def insert(registroForm):
    conectInsert = Conexion("INSERT INTO movement (date, concept, quantity) VALUES (?,?,?);",registroForm)
    conectInsert.con.commit()#funcion para validar el registro antes de guardarlo
    conectInsert.con.close()

def select_by(id):
    conectSelectBy= Conexion(f"SELECT * from movement WHERE id={id};")
    result = conectSelectBy.res.fetchall()
    conectSelectBy.con.close()
    try:
        return result[0]
    except IndexError:
        return []

    

def delete_by(id):
    conectDelete= Conexion(f"DELETE FROM movement WHERE id={id};")
    conectDelete.con.commit()#funcion para validar borrado
    conectDelete.con.close()

def update_by(id,registros):
    conectUpdate = Conexion(f"UPDATE movement SET date=?,concept=?, quantity=? WHERE id={id};",registros)    
    conectUpdate.con.commit()#funcion para validar update
    conectUpdate.con.close()    
    
def select_ingreso():
    conectIngreso=Conexion("select SUM(quantity) from movement where quantity>0;")
    resultadoIngreso = conectIngreso.res.fetchall()
    conectIngreso.con.close()

    return resultadoIngreso[0][0]

def select_egreso():
    conectEgreso=Conexion("select SUM(quantity) from movement where quantity<0;")
    resultadoEgreso = conectEgreso.res.fetchall()
    conectEgreso.con.close()

    return resultadoEgreso[0][0]