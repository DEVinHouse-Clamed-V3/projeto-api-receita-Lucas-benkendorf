import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Receita } from "../entity/Receita";
import { EntityManager } from "typeorm";

export class RecipeController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, preparation_time, is_fitness } = request.body;
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const recipe = new Receita();
      recipe.name = name;
      recipe.preparation_time = preparation_time;
      recipe.is_fitness = is_fitness;

      await queryRunner.manager.save(recipe);
      await queryRunner.commitTransaction();

      return response.status(201).json(recipe);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return response.status(500).json({ message: "Erro ao criar receita", error });
    } finally {
      await queryRunner.release();
    }
  }
}