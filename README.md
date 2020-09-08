# MSCrud

Framework para generar CRUDs dinámicos a partir de objetos. Se basa principalmente en Express, Sequelize y Celebrate.

Solo se debe administrar la carpeta /models/schemas y definir las propiedades necesarias para que el CRUD se genere automaticamente.

### DESCARGAR

```sh
$ git clone https://github.com/jotacalderon90/MSCrud
```

### INSTALAR DEPENDENCIAS

```sh
$ npm install
```

### GENERAR ARCHIVO DE CONFIGURACIÓN

```sh
/config/environments/development.json
```

```json
{
	"LOG_LEVEL": "DEBUG",
	"HTTP_PORT": 3000,
	"DATABASE": {
		"host": "localhost",
		"username": "user",
		"password": "password",
		"database": "schema",
		"dialect": "mysql"
	}
}
```

### GENERAR MODELO DEMO

```sh
/models/schemas/tbl_demo.js
```

```js
const {
	Joi
} = require('celebrate');
const validate = require('../../lib/validate');
const name = __filename.split('\\').join("/").split("/").slice(-1).pop().split(".")[0];

module.exports = function(sequelize, DataTypes) {
	return sequelize.define(name, {
		id_demo: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			ON: {
				COUNT: Joi.number().integer().positive(),
				GET: Joi.number().integer().positive()
			}
		},
		description: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
			ON: {
				COUNT: Joi.string().trim(),
				GET: Joi.string().trim(),
				POST: Joi.string().required().trim(),
				PUT: Joi.string().trim()
			}
		},
		state : {
			type : DataTypes.ENUM,
			values: ['active', 'inactive', 'deleted'],
			defaultValue : 'inactive',
			ON: {
				COUNT: Joi.string().trim(),
				GET: Joi.string().trim(),
				POST: Joi.string().trim(),
				PUT: Joi.string().trim(),
				GROUP: true
			}
		},
		created_at : {
			type : 'TIMESTAMP',
			defaultValue : sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: name,
		timestamps: false
	});
};
```

### LEVANTAR APP
```js
npm start
```

Si todo va bien, el sistema se levantará en el puerto 3000. 


### PROBAR EN UN CLIENTE REST
| METODO| URL|DESCRIPCION|
| ------------- | ------------- |------------- |
| GET| /:object/count  |obtiene cantidad de registros, puede ser agrupado por los campos que contengan el atributo ON.GROUP = true |
| GET| /:object|obtiene registros paginados|
| POST| /:object|crea un registro |
| GET| /:object/:id|lee registro por su PK |
| PUT| /:object/:id|actualiza registro por PK |
| DELETE| /:object/:id|elimina registro por PK |


### Por seguridad debes configurar una cabecera x-api-key en las llamadas
```js
x-api-key=mLOnjquDzVTQIbuzyBUHIJRINTXkV20C
```
 

Cualquier comentario favor informar. Suerte y buenos códigos ;) 


License
----

MIT