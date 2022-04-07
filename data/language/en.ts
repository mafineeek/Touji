export default {
  data: {
    addons: {
      botWelcomeText:
        "Hello! I'm Touji, multipurpose bot for Discord.\nCommands size: **{{commandsSize}}**.",
      mentionReplyText: "Hello! You can use my commands by pressing **`/`**.",
    },
    commands: {
      mee6: {
        warning: {
          overwrite:
            "Watch out! This will overwrite all levels of this guild, if we can't find this guild in MEE6 database, all user's data will be __**irretrievably deleted**__.\nAre you sure you want Touji to start migration?",
        },
        error: {
            401: `This guild is not listed in MEE6 database.`,
        },
        fullfilled: "Migration completed.",
      },
      help: {
        invalid: "Invalid command",
        commandInfo: "Informations about command **{{commandName}}**:",
        requiredPermissions: "Required permissions",
      },
      appinfo: {
        invalidApp: "Invalid app ID provided",
        guildCount: "Guild count",
      },
      userinfo: {
        accountCreated: "Account created",
        isBot: "Is bot?",
        roles: "Roles",
        topRole: "Top role",
        birthdayDate: "Birthday date",
      },
      serverinfo: {
        createdAt: "Created at",
        memberCount: "Members count",
        features: "Features",
        boosts: "Boosts",
        guildFeatures: {
          ANIMATEDICON: "Animated icon",
          BANNER: "Banner",
          COMMERCE: "Commerce",
          COMMUNITY: "Community",
          DISCOVERABLE: "In Server Discovery",
          FEATURABLE: "Featurable",
          INVITESPLASH: "Invite banner",
          MEMBERVERIFICATIONGATEENABLED: "Verification Gate",
          MONETIZATIONENABLED: "Monetization enabled",
          MORESTICKERS: "More sticker slots",
          NEWS: "Announcement channels",
          PARTNERED: "Discord Partner",
          PREVIEWENABLED: "Preview Enabled",
          PRIVATETHREADS: "Private threads",
          THREADSENABLED: "Threads enabled",
          SEVENDAYTHREADARCHIVE: "Seven day thread archive",
          THREEDAYTHREADARCHIVE: "Three day thread archive",
          TICKETEDEVENTSENABLED: "Ticketing enabled",
          VANITYURL: "Vanity URL",
          VERIFIED: "Verified",
          VIPREGIONS: "VIP Regions",
          WELCOMESCREENENABLED: "Welcome Screen enabled",
          NEWTHREADPERMISSIONS: "New thread permissions",
        },
      },
      case: {
        invalid: "Invalid case ID provided",
        user: "User",
        moderator: "Moderator",
      },
      setReason: {
        invalid: "Invalid case ID provided",
        tooBig: "Reason is too big",
        changed:
          "Successfully changed reason of case `{{case}}` to `{{reason}}`.",
      },
      history: {
        noCases: {
          me: "You don't have any case",
          user: "This user doesn't have any case",
        },
        cantSeeOther: "You can't see other user cases",
      },
      kick: {
        invalidUser: "Could not find that user on this guild",
        noBotPermissions: "I don't have permissions to kick this user",
        noUserPermissions:
          "You can't kick this person due to permissions hierarchy",
        reasonTooLong: "Reason is too long",
        success: "Successfully kicked `{{user}}` with reason {{reason}}.",
        successUser: "You are kicked in `{{guildName}}`",
        dmSent: "Sent information on DM?",
        caseID: "Case ID",
      },
      ban: {
        invalidUser: "Could not find that user",
        noBotPermissions: "I don't have permissions to ban this user",
        noUserPermissions:
          "You can't ban this person due to permissions hierarchy",
        reasonTooLong: "Reason is too long",
        success: "Successfully banned `{{user}}` with reason {{reason}}.",
        successUser: "You are banned in `{{guildName}}`",
        dmSent: "Sent information on DM?",
        caseID: "Case ID",
        invalidTime: "Invalid time provided",
        time: "End time",
        alreadyBanned: "This user is already banned",
      },
      unban: {
        invalidUser: "Could not find that user in this guild",
        noBotPermissions: "I don't have permissions to unban this user",
        reasonTooLong: "Reason is too long",
        failed: "An error occured.",
        success: "Successfully unbanned `{{user}}` with reason {{reason}}.",
        successUser: "You are unbanned in `{{guildName}}`",
        dmSent: "Sent information on DM?",
        caseID: "Case ID",
        alreadyUnbanned: "This user is not banned",
      },
      warn: {
        invalidUser: "Could not find that user on this guild",
        yourself: "You can't warn yourself",
        noUserPermissions:
          "You can't warn this person due to permissions hierarchy",
        reasonTooLong: "Reason is too long",
        failed: "An error occured.",
        success: "Successfully warned `{{user}}` with reason {{reason}}.",
        successUser: "You are warned in `{{guildName}}`",
        dmSent: "Sent information on DM?",
        caseID: "Case ID",
      },
      deleteCase: {
        invalid: "Invalid case ID provided",
        own: "You can't delete your own punishments",
        success: "Successfully deleted case `#{{id}}`.",
        promptText:
          "Are you sure you want to delete the case with ID `{{id}}`?",
      },
      embed: {
        invalidHEX: "Invalid HEX color",
        invalidURL: "Invalid URL",
        ask: "This is what your embed looks like. Do you confirm its sending?",
        titleTooLong: "Title is too long",
        descTooLong: "Description is too long",
        footerTooLong: "Footer is too long",
      },
      choose: {
        notEnough: "Not enough options (min. 2)",
        choosen: "I choose... **{{answer}}**!",
      },
      eightBall: {
        answers: [
          "Yes!",
          "No!",
          "Probably yes!",
          "Probably no!",
          "I don't know!",
          "Give me a while",
        ],
        invalid: "Question is invalid",
        question: "Question",
        answer: "Answer",
      },
      giveaway: {
        prizes: [
          "New T-Shirt",
          "A new, exclusive rank",
          "Access to staff channels",
        ],
        invalidTime: "Invalid time",
        invalidChannel: "Invalid channel",
        tooLongPrize: "Prize can contain only 200 characters",
        started: ":tada: **NEW GIVEAWAY!** :tada:\nReact :tada: to enter!",
        prize: "Prize",
        host: "Created by",
        time: "End time",
        winners: "Winner count",
        createdIn: "New giveaway created in {{channel}}.",
      },
      greroll: {
        invalidGiveaway: "Invalid giveaway or giveaway not ended",
        success: "Successfully re-rolled this giveaway.",
      },
      gend: {
        invalidGiveaway: "Invalid giveaway or giveaway ended",
        success: "Successfully ended this giveaway.",
      },
      birthday: {
        alreadySetted:
          "You have already set your birthday to **{{day}}**.**{{month}}**. You need to contact support to change it.",
        invalidDate: "Invalid date",
        updated: "Updated your birth date to **{{day}}**.**{{month}}**.",
        noneNext: "Unfortunately, no one was born this month.",
        noneToday: "Unfortunately, no one was born today.",
        noData: "The user **{{user}}** hasn't set his birth date...",
        date: "The user **{{user}}** has birthdays <t:{{time}}:R>.",
      },
      rps: {
        invalidUser: "Invalid user provided",
        cannotPlay:
          "This user will not play with you because them are offline or invisible.",
        move: "{{user}} move!",
        results: "Winner: {{winner}}\nLoser: {{loser}}",
        tie: "Tie!",
        withUs: "You cannot play with... you.",
        waiting: "Waiting for {{user}} acceptation...",
      },
      config: {
        invalidChannel: "Invalid channel",
        changed: "Successfully updated {{changed}} to {{new}}.",
        modLogChannel: "Moderation logs channel",
        birthdaysChannel: "Birthday channel",
        welcomeStatus: "Welcome module status",
        welcomeChannel: "Welcome channel",
        noLevellingChannel: "{{action}} {{channel}} as no levelling channel",
        welcomeMessage: "Welcome message",
        language: "Language",
        invalidWelcomeMessage:
          "Welcome message cannot contains more than 300 characters",
        goodbyeStatus: "Goodbye module status",
        goodbyeChannel: "Goodbye channel",
        goodbyeMessage: "Goodbye message",
        invalidGoodbyeMessage:
          "Goodbye message cannot contains more than 300 characters",
        variables:
          "{{user}} - user mention\n{{user:id}} - user ID\n{{user:name}} - user name\n{{user:tag}} - user tag\n{{guild:id}} - guild ID\n{{guild:name}} - guild name\n{{guild:ownerID}} - guild owner ID\n\n{{level}} - user level (Only levelling)",
        starboardStatus: "Starboard status",
        starboardChannel: "Starboard channel",
        starboardStarCount: "Starboard star count",
        snipeStatus: "Snipe status",
        starboardBans: "Starboard banned users",
        invalidStarCount:
          "The number of stars is less than 1 or bigger than member count on this server",
        levellingStatus: "Levelling module status",
        levellingChannel: "Levelling channel",
        levellingMessage: "Levelling message",
        levellingNeededXP: "Levelling needed XP",
        autoroles: "Autoroles",
        suggestionsChannel: "Suggestion channel",
        suggestionsThreadCreate: "`Hey, {{USERMENTION}! Thanks for your suggestion for **{{GUILDNAME}}**. I created a thread for you to discuss it with others.`",
        invalidLevellingMessage:
          "Levelling message cannot contains more than 300 characters",
        invalidLevellingNeededXP:
          "The number of XP required to level up must be greater than 10 and less than 1000",
        theSameLanguage: "This language is already setted",
      },
      autorole: {
        alreadyAdded: "This role is already added to guild config",
        notAdded: "This autorole is not added to guild config",
        dontHavePermissions:
          "You don't have permissions to edit this role due to permissions hierarchy",
        added: "Successfully added autorole with name `{{roleName}}`.",
        removed: "Successfully removed autorole with name `{{roleName}}`.",
        noAutoRoles: "This server does not have autoroles",
        invalidRole: "This role is managed",
      },
      roleRewards: {
        alreadyAdded: "This level is already added to role rewards",
        notAdded: "This role reward is not added",
        dontHavePermissions:
          "You don't have permissions to edit this role due to permissions hierarchy",
        added: "Successfully added level reward for level `{{level}}`",
        removed: "Successfully removed level reward for level `{{level}}`",
        noRoles: "This server does not have role rewards",
        invalidRole: "This role is managed",
        invalidLevel:
          "Level must be greater than 0 and smaller or equal to 100",
      },
      snipe: {
        notEnabled: "Snipe on this server is disabled",
        none: "Could not find a message with this index",
        oldContent: "Old content",
        content: "Content",
        author: "Author",
        type: "Snipe type",
        dontHavePermissions: {
          seeUser: "You don't have permissions to see other user snipe list",
          delUser: "You don't have permissions to delete other user snipe list",
          delChannel: "You don't have permissions to delete channel snipe list",
        },
        deletedByUser: "Successfully deleted provided user snipe list",
        deletedByChannel: "Successfully deleted provided channel snipe list",
      },
      pornhub: {
        tooLong: "At least one part of the text is too long",
      },
      supreme: {
        tooLong: "Text is too long",
      },
      starboard: {
        noBest: "**{{user}}** doesn't have best message",
        invalidUser: "Invalid user",
        alreadyBanned: "This user is already banned",
        banned: "Successfully banned **{{user}}** from starboard",
        notBanned: "This user is not banned",
        unbanned: "Successfully unbanned **{{user}}** from starboard",
        noPermissions: "You don't have permissions to {{to}} this user",
        banSomeone: "You can't ban someone",
        bestMessage:
          "**{{user}}** best message in {{guild}}:\n[click]({{url}}).\n\nThe message has {{starCount}} stars.",
      },
      reminder: {
        invalidTime: "Invalid time",
        invalidContent: "Reminder content not provided or it's too long",
        invalidID: "Could not find that reminder",
        created: "Successfully created reminder with ID **{{id}}**",
        revoked: "Successfully revoked reminder with ID **{{id}}**",
        none: "You don't have reminders",
      },
      ticket: {
        createTicket: "Create ticket",
        sent: "Successfully created ticket message",
        invalidChannelType: "Channel must be text",
        invalidCategory: "Invalid category channel",
        invalidChannel: "Invalid ticket channel",
        invalidText: "Text cannot have more than 2000 characters",
        invalidMessage:
          "Touji must be author of message. Create new message using **`/embed`** command.",
        notConfigured: {
          channel: "Ticket channel not configured",
          category: "Ticket category not configured",
          message: "Ticket message not configured",
          text: "Ticket text not configured",
        },
        changed: {
          message: "Successfully changed ticket message ID to `{{id}}`",
          channel: "Successfully changed ticket channel to `{{channel}}`",
          category: "Successfully changed ticket category to `{{category}}`",
          status:
            "Successfully changed ticket system status to **`{{status}}`**.",
          text: "Successfully changed ticket text to:\n\n{{text}}",
        },
      },
      balance: {
        bot: "You can't show bot balance. Bots are not part of economy.",
        cash: "Cash",
        bank: "Bank",
        total: "Total",
      },
      addMoney: {
        invalidAmount: "Invalid amount of money",
        success: "Successfully added `{{money}}$` to {{user}}",
      },
      removeMoney: {
        invalidAmount: "Invalid amount of money",
        success: "Successfully removed `{{money}}$` from {{user}}",
      },
      deposit: {
        invalidAmount: "Invalid money amount",
        success: "Successfully deposited `{{money}}$` to bank.",
      },
      withdraw: {
        invalidAmount: "Invalid amount",
        success: "Successfully withdrawed `{{money}}$` to wallet.",
      },
      work: {
        messages: [
          "You worked at the club and you get {{amount}}$",
          "You discovered a new chemical element and made {{amount}}$",
          "You win the eating contest. The prize for 1th place is {{amount}}$!",
          "You work 2 hours at a local McDonalds. You received {{amount}}$.",
          "You work as a Touji brand ambassador and earn {{amount}}$.",
          "You sold your lenses and earned {{amount}}$.",
          "You've added a computer self-destruct to the code if you don't have a license! Your boss rewarded you {{amount}}$.",
        ],
      },
      createItem: {
        steps: {
          1: "Choose the name of your item. This **cannot contains more than 50 characters.**",
          2: "Choose description of your item. This **cannot contains more than 150 characters.**",
          3: "Choose price of your item. Must be greater than 1 and shorter or equal to 1 000 000.",
          4: "Enter the role to be given after the item is purchased. Even if you don't provide a valid role at this point, it won't pass anyway because the validator will **reject your answer**. If you don't want given role, type none.",
          5: "Enter the role to be removed after the item is purchased. Even if you don't provide a valid role at this point, it won't pass anyway because the validator will **reject your answer**. If you don't want removed role, type none.",
        },
        invalidName: "Invalid item name",
        invalidRole: "Invalid role provided. Try entering ID of the role.",
        invalidPrice: "Invalid price provided.",
        alreadyExists: "Item with this name already exists",
        success: "Successfully created new item with id **{{id}}**",
      },
      shop: {
        none: "Unfortunately, no one has added any items yet. This can be done with the command **`/create-item`**.",
      },
      deleteItem: {
        none: "Invalid ID provided",
        areYouSure: "Are you sure to delete item with ID **{{id}}**?",
        success: "Successfully deleted item with ID **{{id}}**",
      },
      inventory: {
        none: "You don't have items in your inventory.",
      },
      buyItem: {
        invalidItem: "Invalid item ID",
        notEnoughWallet:
          "You don't have enough money in your wallet. You need additional **{{amount}}$**.",
        success: "You successfully bought this item",
      },
      clearInventory: {
        invalidMember: "This member is not on this guild",
        success: "Successfully cleared this user inventory",
      },
      rob: {
        unknownUser: "This member is not on this guild",
        notEnoughMoney: "The user must have at least $10 in their wallet",
        fail: "You failed to rob {{user}}. You lose {{change}}$.",
        success: "You successfully robbed {{user}} and gained {{change}}$.",
        withUs: "You're trying to rob yourself. Wait, that's illegal!",
        bot: "You can't rob bot",
      },
      itemInfo: {
        description: "Description",
        price: "Price",
        givenRole: "Role added after buy",
        removedRole: "Role removed after buy",
      },
      reload: {
        invalid: "Invalid command name",
        success: {
          all: "Successfully reloaded all commands",
          command: "Successfully reloaded this command",
        },
      },
      editItem: {
        noneProvided:
          "Hey you there! You want to trick me? No way! Enter at least one option to change",
        invalid: {
          name: "Invalid name",
          description: "Invalid description",
          price: "Invalid price",
        },
        errors: "Errors occurred while executing the command:\n{{errors}}",
        success: "Successfully updated these properties:\n\n{{replaced}}",
      },
      editEmbed: {
        noneProvided:
          "Hey you there! You want to trick me? No way! Enter at least one option to change",
        invalidMessage: "Invalid message ID",
        invalidMessageAuthor: "Touji must be author of provided message",
        invalid: {
          title: "Invalid title",
          description: "Invalid description",
          footer: "Invalid footer",
          color: "Invalid color",
          imageURL: "Invalid image URL",
          thumbnailURL: "Invalid thumbnail URL",
          url: "Invalid URL",
        },
        errors: "Errors occurred while executing the command:\n{{errors}}",
        success: "Successfully updated these embed properties:\n\n{{replaced}}",
      },
      rank: {
        disabled: "Level system on this guild is disabled",
        bot: "You can't show bot rank. Bots are not part of levelling.",
      },
      levelsLeaderboard: {
        disabled: "Level system on this guild is disabled",
        noLeaderboard: "There is no levelling leaderboard on this server",
        onlineOutNow: `Hey, our online leaderboard is out now!`
      },
      setLevel: {
        disabled: "Level system on this guild is disabled",
        invalidUser: "Could not find that user on this guild",
        invalidLevel: "Level must be greater than 0 and smaller than 100",
        noUserPermissions: "You don't have permissions to manage this member",
        success: "{{user}} is now level {{level}}",
      },
      setXP: {
        disabled: "Level system on this guild is disabled",
        invalidUser: "Could not find that user on this guild",
        invalidXP:
          "XP must be greater than 0 and smaller than {{guildRequiredXP}}",
        noUserPermissions: "You don't have permissions to manage this member",
        success: "{{user}} has now {{xp}} XP",
      },
      economyLeaderboard: {
        noLeaderboard: "There is no economy leaderboard on this server",
        mode: {
          byWallet: "Order by wallet balance",
          byBank: "Order by bank balance",
        },
      },
      reactionRole: {
        invalidMessage: "Invalid message ID",
        invalidRole: "Invalid role",
        invalidEmoji: "Invalid emoji",
        alreadyExists: "This reactionrole already exists",
        failed: "I can't add reaction to this message",
        successAdd: "Successfully added new reactionrole",
        successRemove: "Successfully removed this reactionrole",
        invalidRR: "Could not find that reactionrole",
      },
      createTag: {
        tooLong: "Content or name is too long",
      },
      permissions: {
        noGlobalPermissions: "You can't manage global permissions",
        allowedUser: "Allowed permissions for this user",
        allowedGroup: "Allowed permissions for this group",
        groupInvalid: "Invalid group",
        groupNoPermissions: "This group does not have defined permissions",
        userNoPermissions: "This user does not have defined permissions",
        noPermissions: "You don't have permissions",
        cantEdit: "You can't edit this permission",
        groupAlreadyExists: "Group with this name already exists",
        alreadyHasPermissions: "This user already has permission `{{pex}}`",
        doesNotHavePermissions: "This user does not have permission `{{pex}}`",
        invalidUser: "Invalid user",
        invalidPEX: "Invalid PEX",
        inGroup: "This user is already in this group",
        notInGroup: "This user is not in this group",
        success: {
          addToGroup: "Successfully added this user to group `{{name}}`",
          removeFromGroup:
            "Successfully removed this user from group `{{name}}`",
          createGroup: "Successfully created new group with name `{{name}}`",
          removeGroup: "Successfully removed group with name `{{name}}`",
          addPEXToUser: "Successfully added `{{pex}}` to this user",
          removedPEXFromUser: "Successfully removed `{{pex}}` from this user",
          addPEXToGroup: "Successfully added `{{pex}}` to this group",
          removedPEXFromGroup: "Successfully removed `{{pex}}` from this group",
          addRoleToGroup: "Successfully added role `{{role}}` to this group",
          removedRoleFromGroup:
            "Successfully removed role `{{role}}` from this group",
          addGlobalPEX: "Successfully added permissions `{{pex}}` to all users",
          removedGlobalPEX:
            "Successfully removed permission `{{pex}}` from all users",
        },
        error: {
          addPEXToGroup: "This group already has permission `{{pex}}`",
          removedPEXFromGroup: "This group does not have permission `{{pex}}`",
          addRoleToGroup: "This group already added role `{{role}}`",
          removedRoleFromGroup: "This group does not have role `{{role}}`",
          addGlobalPEX: "Users already have permission `{{pex}}`",
          removedGlobalPEX: "Users do not have permission `{{pex}}`",
        },
        tooLong: {
          groupName: "Group name is too long",
        },
        permissions: {
          allowed: "Allowed permissions",
        },
      },
      pay: {
        invalidUser: "This user must be on this guild",
        theSameUser: "You can't transfer money to you",
        invalidAmount: "You don't have that much money in your bank",
        success: "You successfully transfered `{{amount}}$` to {{user}}",
      },
      lock: {
        thread: "You can't lock thread channel",
        success: {
          server: "To lock/unlock this server run this command again.",
          "*": "To lock/unlock this channel run this command again.",
        },
        error: "Can't lock/unlock this channel",
      },
      emojify: { tooLong: "Text too long" },
      reverse: { tooLong: "Text too long" },
      slotMachine: {
        waiting: "[ {{board}} ]\n\n**Waiting...**",
        win: "[ {{board}} ]\n\nCongratulations, you won **{{amount}}$**",
        lost: "[ {{board}} ]\n\nYou lost **{{amount}}$**",
      },
      lotto: {
        repeating: "At least one number is given more than 1 time",
        invalidNumber:
          "At least one number is less than 0, greater than 100, or with a comma.",
        success:
          "Congratulations, you won **{{amount}}$**.\n\nWon numbers: {{numbers}}\nNumber of numbers hit: **{{matching}}**.",
        lost: "Unfortunately, you lost **{{amount}}$**.\n\nWon numbers: {{numbers}}\nNumber of numbers hit: **{{matching}}**.",
      },
      dick: {
        success: "The length of your dick is **{{length}}cm**.\n\n**{{dick}}**",
      },
    },
  },
  opt: {
    mee6: {
      levels: {
        desc: "Migrate MEE6 levels to Touji levelling",
      },
    },
    help: {
      command: {
        desc: "Command",
      },
    },
    appinfo: {
      appid: {
        desc: "Application ID",
      },
    },
    eval: {
      code: {
        desc: "Code to evaluate",
      },
      async: {
        desc: "Async or sync?",
      },
    },
    shell: {
      code: {
        desc: "Code to evaluate in console",
      },
    },
    userinfo: {
      user: {
        desc: "User",
      },
    },
    case: {
      id: {
        desc: "Case ID",
      },
    },
    setReason: {
      id: {
        desc: "Case ID",
      },
      reason: {
        desc: "New reason",
      },
    },
    history: {
      user: {
        desc: "User",
      },
    },
    kick: {
      user: {
        desc: "User",
      },
      reason: {
        desc: "Reason",
      },
    },
    ban: {
      user: {
        desc: "User",
      },
      time: {
        desc: "Time if ban is temporary",
      },
      reason: {
        desc: "Reason",
      },
    },
    unban: {
      user: {
        desc: "User",
      },
      reason: {
        desc: "Reason",
      },
    },
    warn: {
      user: {
        desc: "User",
      },
      reason: {
        desc: "Reason",
      },
    },
    deleteCase: {
      id: {
        desc: "Case ID",
      },
    },
    embed: {
      title: {
        desc: "Title",
      },
      description: {
        desc: "Description",
      },
      color: {
        desc: "Color",
      },
      footer: {
        desc: "Footer",
      },
      imageURL: {
        desc: "Image URL",
      },
      thumbnailURL: {
        desc: "Thumbnail URL",
      },
      url: {
        desc: "Embed URL",
      },
    },
    eightBall: {
      question: {
        desc: "Question",
      },
    },
    giveaway: {
      time: {
        desc: "Giveaway end time",
      },
      channel: {
        desc: "Giveaway channel",
      },
      prize: {
        desc: "Giveaway prize",
      },
      winnerCount: {
        desc: "Winners",
      },
    },
    greroll: {
      messageID: {
        desc: "Giveaway message ID",
      },
    },
    gend: {
      messageID: {
        desc: "Giveaway message ID",
      },
    },
    birthday: {
      set: {
        desc: "Update your birthday date",
      },
      next: {
        desc: "Show all users who have birthdays this month",
      },
      today: {
        desc: "Show all users who have birthdays today",
      },
      day: {
        desc: "Day",
      },
      month: {
        desc: "Month",
      },
      showUser: {
        desc: "Show provided user birthday date",
      },
      user: { desc: "User" },
    },
    rps: {
      user: {
        desc: "User",
      },
    },
    pornhub: {
      textOne: {
        desc: "Text one",
      },
      textTwo: {
        desc: "Text two",
      },
    },
    supreme: {
      text: {
        desc: "Text",
      },
      mode: {
        desc: "Mode",
      },
    },
    config: {
      language: {
        desc: "Language",
      },
      modLogChannel: {
        desc: "Change moderation logs channel",
      },
      birthdayChannel: {
        desc: "Change birthday channel",
      },
      suggestionsChannel: {
        desc: "Suggestions channel",
      },
      channel: {
        desc: "Channel",
      },
      message: {
        desc: "Message",
      },
      display: {
        desc: "Display guild config",
      },
      welcomeStatus: {
        desc: "Welcome status",
      },
      welcomeChannel: {
        desc: "Welcome channel",
      },
      welcomeMessage: {
        desc: "Welcome message",
      },
      goodbyeStatus: {
        desc: "Goodbye status",
      },
      goodbyeChannel: {
        desc: "Goodbye channel",
      },
      goodbyeMessage: {
        desc: "Goodbye message",
      },
      starboardStatus: {
        desc: "Starboard status",
      },
      starboardChannel: {
        desc: "Starboard channel",
      },
      starboardStars: {
        desc: "Starboard star count",
      },
      snipeStatus: {
        desc: "Snipe status",
      },
      status: {
        desc: "Status",
      },
      variables: {
        desc: "Variables to pass",
      },
      levellingStatus: {
        desc: "Levelling status",
      },
      levellingBlockedChannel:{
        desc: 'Add/remove channels where you cant earn XP.',
      },
      ghostPing: {
        desc: "Anty Ghostping",
      },
      levellingChannel: {
        desc: "Levelling channel",
      },
      levellingMessage: {
        desc: "Levelling message",
      },
      levellingNeededXP: {
        desc: "XP needed to reach next level",
      },
      xp: {
        desc: "XP",
      },
    },
    trash: {
      user: {
        desc: "User",
      },
    },
    snipe: {
      user: {
        desc: "User",
      },
      channel: {
        desc: "Channel",
      },
      deleted: {
        desc: "Show deleted messages",
      },
      edited: {
        desc: "Show edited messages",
      },
      index: {
        desc: "Index",
      },
      deleteUser: {
        desc: "Delete user snipe list",
      },
      deleteChannel: {
        desc: "Delete channel snipe list",
      },
    },
    starboard: {
      top: {
        desc: "Get top user message",
      },
      ban: {
        desc: "Ban user from starboard",
      },
      unban: {
        desc: "Unban user from starboard",
      },
      best: {
        desc: "Get best user message",
      },
      banUser: {
        desc: "User to ban",
      },
      unbanUser: {
        desc: "User to unban",
      },
      bestUser: {
        desc: "User",
      },
    },
    emojify: {
      text: {
        desc: "Text",
      },
    },
    reminder: {
      add: {
        desc: "Add a reminder",
      },
      revoke: {
        desc: "Revoke reminder",
      },
      list: {
        desc: "Display your reminders",
      },
      time: {
        desc: "Time",
      },
      content: {
        desc: "Content",
      },
      id: {
        desc: "ID",
      },
    },
    ticket: {
      message: {
        desc: "Change ticket message",
      },
      setChannel: {
        desc: "Change ticket channel",
      },
      setCategory: {
        desc: "Set ticket category",
      },
      setText: {
        desc: "Change ticket text",
      },
      setStatus: {
        desc: "Set ticket status",
      },
      channel: {
        desc: "Channel",
      },
      category: {
        desc: "Category",
      },
      status: {
        desc: "Ticket status",
      },
      messageID: {
        desc: "Message ID",
      },
      text: {
        desc: "Text",
      },
    },
    balance: {
      user: {
        desc: "User",
      },
    },
    addMoney: {
      user: {
        desc: "User",
      },
      money: {
        desc: "Amount of money",
      },
      type: {
        desc: "Type",
      },
    },
    removeMoney: {
      user: {
        desc: "User",
      },
      money: {
        desc: "Amount of money",
      },
      type: {
        desc: "Type",
      },
    },
    deposit: {
      amount: {
        desc: "Amount of money",
      },
    },
    withdraw: {
      amount: {
        desc: "Amount of money",
      },
    },
    deleteItem: {
      id: {
        desc: "ID of the item",
      },
    },
    buyItem: {
      id: {
        desc: "ID of the item",
      },
    },
    clearInventory: {
      user: {
        desc: "User",
      },
    },
    rob: {
      user: {
        desc: "User",
      },
    },
    itemInfo: {
      id: {
        desc: "ID of the item",
      },
    },
    reload: {
      commandName: {
        desc: "Command name or *",
      },
    },
    editItem: {
      id: {
        desc: "Item ID",
      },
      name: {
        desc: "New item name",
      },
      description: {
        desc: "New item description",
      },
      price: {
        desc: "New item price",
      },
    },
    editEmbed: {
      channel: {
        desc: "Channel where embed is",
      },
      messageID: {
        desc: "Embed message ID",
      },
      title: {
        desc: "New embed title",
      },
      description: {
        desc: "New embed description",
      },
      color: {
        desc: "New embed color",
      },
      footer: {
        desc: "New embed footer",
      },
      imageURL: {
        desc: "New embed image URL",
      },
      thumbnailURL: {
        desc: "New embed thumbnail URL",
      },
      url: {
        desc: "New embed URL",
      },
    },
    autorole: {
      add: {
        desc: "Create autorole",
      },
      remove: {
        desc: "Remove autorole",
      },
      list: {
        desc: "List guild autoroles",
      },
      role: {
        desc: "Role",
      },
    },
    roleRewards: {
      add: {
        desc: "Create role reward",
      },
      remove: {
        desc: "Remove role reward",
      },
      list: {
        desc: "List guild role rewards",
      },
      role: {
        desc: "Role",
      },
      level: {
        desc: "Level",
      },
    },
    rank: {
      user: {
        desc: "User",
      },
    },
    setLevel: {
      user: {
        desc: "User",
      },
      newLevel: {
        desc: "New level",
      },
    },
    setXP: {
      user: {
        desc: "User",
      },
      newXP: {
        desc: "New XP amount",
      },
    },
    economyLeaderboard: {
      mode: {
        desc: "Filtering mode",
      },
    },
    reactionRole: {
      add: {
        desc: "Create reaction role",
      },
      remove: {
        desc: "Remove reaction role",
      },
      channel: {
        desc: "Channel where message is in",
      },
      messageID: {
        desc: "Reaction role message ID",
      },
      role: {
        desc: "Role to give",
      },
      emoji: {
        desc: "Emoji",
      },
    },
    permissions: {
      manageGlobal: {
        desc: "Manage global permissions",
      },
      manageGroup: {
        desc: "Manage group",
      },
      addGlobalPermissions: {
        desc: "Add global permission",
      },
      removeGlobalPermissions: {
        desc: "Remove global permission",
      },
      addUserToGroup: {
        desc: "Add user to group",
      },
      removeUserFromGroup: {
        desc: "Remove user from group",
      },
      addGroup: {
        desc: "Create group",
      },
      removeGroup: {
        desc: "Remove group",
      },
      list: {
        desc: "List group permissions",
      },
      userManage: {
        desc: "Manage user permissions",
      },
      addUser: {
        desc: "Add permissions to user",
      },
      removeUser: {
        desc: "Remove permissions from user",
      },
      getUser: {
        desc: "Display user permissions",
      },
      addPermissionsToGroup: {
        desc: "Add permissions to group",
      },
      removePermissionsFromGroup: {
        desc: "Remove permissions from group",
      },
      addRoleToGroup: {
        desc: "Add role to group",
      },
      removeRoleFromGroup: {
        desc: "Remove role from group",
      },
      name: { desc: "Name" },
      user: { desc: "User" },
      pex: { desc: "PEX" },
      role: { desc: "Role" },
    },
    pay: {
      user: { desc: "User" },
      amount: { desc: "Amount of money" },
    },
    lock: { server: { desc: "Lock server?" } },
    reverse: { text: { desc: "Text" } },
    lotto: { number: { desc: "Number {{number}}" } },
  },
};