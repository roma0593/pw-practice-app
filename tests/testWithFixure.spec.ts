import { test } from "../testOptions";
import { faker } from "@faker-js/faker";

test("parametrized methods", async ({ pageManager }) => {
    const fullNameRandom = faker.person.fullName();
    const randomEmail = `${fullNameRandom.replace(" ", "")}${faker.number.int(1000)}@test.com`;

    await pageManager
        .onFormLayoutsPage()
        .submitUsingTheGridFormWithCredsAndSelectOption(
            randomEmail,
            "Welcome1",
            "Option 1"
        );
});