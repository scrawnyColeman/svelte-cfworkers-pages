import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import type { IRequest } from 'itty-router';
import { ThrowableRouter, error, json, missing } from 'itty-router-extras';
import { createCors } from 'itty-cors';

import { comments } from './schema';

type Env = {
  DB: D1Database;
};

type RequestWithDB = IRequest & { db: DrizzleD1Database };

const { preflight, corsify } = createCors();
const router = ThrowableRouter();

const injectDB = (request: IRequest, env: Env) => {
  request.db = drizzle(env.DB);
};

router
  .all('*', preflight)
  //@ts-ignore
  .get('/comments', injectDB, async (request: RequestWithDB, _: Env) => {
    const query = request.db.select().from(comments);
    const result = await query.all();
    return json(result);
  })
  //@ts-ignore
  .get('/comments/seed/:postSlug', injectDB, async (request: RequestWithDB, _: Env) => {
    const { postSlug } = request.params!;
    const mutation = request.db
      .insert(comments)
      .values({
        author: 'Seeded Sam',
        body: 'This is a seeded comment.',
        postSlug,
      })
      .returning();
    const result = await mutation.get();
    return json(result);
  })
  //@ts-ignore
  .get('/comments/:id', injectDB, async (request: RequestWithDB, _: Env) => {
    const query = request.db
      .select()
      .from(comments)
      .where(eq(comments.id, Number(request.params!['id'])));
    const result = await query.get();
    return json(result);
  })
  .all('*', () => missing('Are you sure about that?'));

export default {
  //@ts-ignore
  fetch: (...args) =>
    router
      //@ts-ignore
      .handle(...args)
      .catch((err) => error(500, err.stack))
      .then(corsify), // cors should be applied to error responses as well
};
