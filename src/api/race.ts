async function init(excludes?: string[]): Promise<void> {
    for (const account in data.accounts) {
        if (account == "fp") continue;
        if (excludes?.includes(account)) continue;
        await login(account, ["", "",
            data.accounts[account].user,
            data.accounts[account].pass,
            data.accounts[account].school])
            .then((val: string) => console.log(`INFO: ${val}`));
    }
}

async function deinit(excludes?: string[]): Promise<void> {
    for (const account in data.accounts) {
        if (account == "fp") continue;
        if (excludes?.includes(account)) continue;
        await logout(account)
            .then((val: string) => console.log(`INFO: ${val}`));
    }
}