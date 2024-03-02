import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
export const createFile = mutation({
    args: {
        name: v.string()
    },
    handler: async (ctx, args) => {
        const loggedInUser = await ctx.auth.getUserIdentity();
        if (!loggedInUser) throw new ConvexError('User muse be logged in')
        await ctx.db.insert('files', {
            name: args.name
        })
    }
})
export const getFiles = query({
    args: {},
    handler: async (ctx, args) => {
        const loggedInUser = await ctx.auth.getUserIdentity();
        if (!loggedInUser) return []
        return await ctx.db.query('files').collect()
    }
})