
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';



const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'JobhuntZW API Docs',
            version: "1.0.0"
        },


    },
    apis: ['./models/*.js', './routes/*.js'], // files containing annotations as above
};


const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app, port) => {

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec)
    });

    console.info(`Docs available at https://jobhuntzw-production.up.railway.app:${port}/docs`)
}


export default swaggerDocs;