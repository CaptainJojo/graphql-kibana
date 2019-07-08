const CharacterSchema = {
    up: (knex, Promise) => {
        return Promise.all([
            knex.schema.createTable('character', table => {
                table.increments();
                table.timestamps(true, true);
                table.string('slug').notNullable();
                table.string('name').notNullable();
                table.json('titles');
                table.enum('gender', ["MALE", "FEMALE"]);
                table.string('culture');
                table.integer("mother_id");
                table.foreign("mother_id").references("character.id");
                table.integer("father_id");
                table.foreign("father_id").references("character.id");
            })
        ]);
    },
    down: (knex, Promise) => {
        return Promise.all([
            knex.schema.dropTable('character')
        ]);
    }
}

module.exports = CharacterSchema;
