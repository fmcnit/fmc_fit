import { z } from 'zod/v4';
import "dotenv/config";

import Fastify from 'fastify'
const app = Fastify({
  logger: true
})
import { serializerCompiler, validatorCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';




app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'BootCamp Treinos',
      description: 'Sample backend service',
      version: '1.0.0',
    },
    servers: [
      {
        description: "Localhost",
        url: "http://localhost:8081",
      }
    ],
  },
  transform: jsonSchemaTransform,

});

await app.register(fastifySwagger, {
  routePrefix: '/docs',
}); 


app.withTypeProvider<ZodTypeProvider>().route({
  method: 'GET',
  url: '/',
 
  schema: {
    description: 'Hello World',
    tags: ['hello'],
    response: {
      200: z.object({
        message: z.string(),
      }),

    },
  },
  handler: () => {
    return { 
      message: 'Hello World' 
    }
  },
});


try {
  await app.listen({ port: Number(process.env.PORT) || 8081})
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
