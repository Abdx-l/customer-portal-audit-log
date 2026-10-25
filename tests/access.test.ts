import{test,after,before}from'node:test';import assert from'node:assert/strict';import request from'supertest';import bcrypt from'bcryptjs';import jwt from'jsonwebtoken';import{app,db}from'../src/app.js';
let customer:string,other:string,agent:string,policy:string;
before(async()=>{await db.auditLog.deleteMany();await db.policy.deleteMany();await db.user.deleteMany();const password=await bcrypt.hash('test-only',4);customer=(await db.user.create({data:{email:'one@test.invalid',password,role:'CUSTOMER'}})).id;other=(await db.user.create({data:{email:'two@test.invalid',password,role:'CUSTOMER'}})).id;agent=(await db.user.create({data:{email:'agent@test.invalid',password,role:'AGENT'}})).id;policy=(await db.policy.create({data:{ownerId:customer,agentId:agent,number:'P1',coverage:100}})).id});
after(()=>db.$disconnect());
const token=(id:string)=>'Bearer '+jwt.sign({sub:id},process.env.JWT_SECRET!,{issuer:'portal'});
test('unauthenticated is rejected',async()=>{assert.equal((await request(app).get('/policies')).status,401)});
test('customers cannot read another policy',async()=>{assert.equal((await request(app).get('/policies/'+policy).set('Authorization',token(other))).status,404)});
test('customers cannot write',async()=>{assert.equal((await request(app).patch('/policies/'+policy).set('Authorization',token(customer)).send({coverage:500})).status,403)});
test('agent writes atomically produce audit',async()=>{assert.equal((await request(app).patch('/policies/'+policy).set('Authorization',token(agent)).send({coverage:500})).status,200);assert.equal(await db.auditLog.count(),1)});
