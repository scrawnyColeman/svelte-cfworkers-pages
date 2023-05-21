import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import type { IRequest } from 'itty-router';
import { ThrowableRouter } from 'itty-router-extras';

import { comments } from './schema';

type Env = {
  DB: D1Database;
};

type RequestWithDB = IRequest & { db: DrizzleD1Database };

const router = ThrowableRouter();

const injectDB = (request: IRequest, env: Env) => {
  request.db = drizzle(env.DB);
};

router
  //@ts-ignore
  .get('/comments', injectDB, async (request: RequestWithDB, _: Env) => {
    const query = request.db.select().from(comments);
    const result = await query.all();
    return new Response(JSON.stringify(result));
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
    return new Response(JSON.stringify(result));
  })
  //@ts-ignore
  .get('/comments/:id', injectDB, async (request: RequestWithDB, _: Env) => {
    const query = request.db
      .select()
      .from(comments)
      .where(eq(comments.id, Number(request.params!['id'])));
    const result = await query.get();
    return new Response(JSON.stringify(result));
  })
  .all('*', () => new Response('Not found.', { status: 404 }));

export default {
  fetch: router.handle,
};
