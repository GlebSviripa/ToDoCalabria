export interface CommonUseCase<Input, Output> {
    execute(input: Input): Promise<Output>
}