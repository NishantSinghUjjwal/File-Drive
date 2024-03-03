import { ConvexError, v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";

export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string()
    },
    handler: async (ctx, args) => {

        console.log("user is being created", args.tokenIdentifier)
        await ctx.db.insert('users', {
            tokenIdentifier: args.tokenIdentifier,
            orgIds: []
        })
    }
})

export const addOrgIdToUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        orgId: v.string()
    },
    handler: async (ctx, args) => {
        console.log("token identifier",args.tokenIdentifier)
        const user = await ctx.db.query('users').withIndex('by_token_identifier', q => q.eq('tokenIdentifier', args.tokenIdentifier)).first()
        if (!user) throw new ConvexError('User is not defiend')
        await ctx.db.patch(user._id, {
            orgIds: [...user?.orgIds, args.orgId]
        })
    }
})