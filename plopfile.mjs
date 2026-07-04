export default function (plop) {
  plop.setGenerator('module', {
    description: 'Generate a NestJS module with controller, service, and tests',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Module name (e.g. product, order):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{dashCase name}}/{{dashCase name}}.module.ts',
        templateFile: 'plop-templates/module.hbs',
      },
      {
        type: 'add',
        path: 'src/{{dashCase name}}/{{dashCase name}}.controller.ts',
        templateFile: 'plop-templates/controller.hbs',
      },
      {
        type: 'add',
        path: 'src/{{dashCase name}}/{{dashCase name}}.service.ts',
        templateFile: 'plop-templates/service.hbs',
      },
      {
        type: 'add',
        path: 'src/{{dashCase name}}/{{dashCase name}}.controller.spec.ts',
        templateFile: 'plop-templates/controller.spec.hbs',
      },
      {
        type: 'add',
        path: 'src/{{dashCase name}}/{{dashCase name}}.service.spec.ts',
        templateFile: 'plop-templates/service.spec.hbs',
      },
    ],
  });

  plop.setGenerator('dto', {
    description: 'Generate a DTO with class-validator decorators',
    prompts: [
      {
        type: 'input',
        name: 'module',
        message: 'Module name (existing module folder):',
      },
      {
        type: 'input',
        name: 'name',
        message: 'DTO name (e.g. create-user, update-order):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{dashCase module}}/dto/{{dashCase name}}.dto.ts',
        templateFile: 'plop-templates/dto.hbs',
      },
    ],
  });
}
