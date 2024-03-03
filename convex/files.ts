import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  });

export const createFile = mutation({
    args: {
        name: v.string(),
        orgId: v.string(),
        fileId:v.id('_storage')
    },
    handler: async (ctx, args) => {
        const loggedInUser = await ctx.auth.getUserIdentity();
        console.log("logged in user",loggedInUser)
        if (!loggedInUser) throw new ConvexError('User muse be logged in')
        await ctx.db.insert('files', {
            name: args.name,
            orgId: args.orgId,
            fileId:args.fileId
        })
    }
})
export const getFiles = query({
    args: {
        orgId:v.string()
    },
    handler: async (ctx, args) => {
        const loggedInUser = await ctx.auth.getUserIdentity();
        if (!loggedInUser) return []
        return await ctx.db.query('files').withIndex('by_orgId',q=>q.eq('orgId',args.orgId)).collect()
    }
})