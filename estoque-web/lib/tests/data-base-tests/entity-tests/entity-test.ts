import assert from "assert";
import { Entity } from "@/lib/models/entity_model";
import { createEntity } from "@/lib/services/entity/create-entity";
import { updateEntity } from "@/lib/services/entity/update-entity";
import { readEntity } from "@/lib/services/entity/read-entity";
import { deleteEntity } from "@/lib/services/entity/delete-entity";
import { listEntities } from "@/lib/services/entity/list-entities";

// Dados de teste
const mockEntity: Entity = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "Empresa Teste",
  email: "teste@empresa.com",
  phone: "(11) 99999-9999",
  address: "Rua Teste, 123",
  description: "Descrição da empresa teste",
  enterprise_id: "456e7890-e89b-12d3-a456-426614174000",
  safe_delete: false,
  created_at: "2023-01-01T00:00:00.000Z"
};

const mockEntityUpdate = {
  name: "Empresa Teste Atualizada",
  email: "novo@empresa.com",
  phone: "(11) 88888-8888",
  address: "Nova Rua, 456",
  description: "Nova descrição"
};

console.log("=== TESTES DAS FUNÇÕES DE ENTIDADE (USANDO SERVICES) ===\n");

// Função auxiliar para executar testes
async function runTest(testName: string, testFunction: () => Promise<void>) {
  try {
    console.log(`🔄 Executando: ${testName}`);
    await testFunction();
    console.log(`✅ PASSOU: ${testName}`);
  } catch (error) {
    console.log(`❌ FALHOU: ${testName}`);
    console.error(`   Erro: ${error}`);
  }
  console.log("");
}

// Testes para createEntity
async function testCreateEntitySuccess() {
  const result = await createEntity(mockEntity);
  assert(result !== null, "Resultado deveria existir");
  console.log("   ✓ Entidade criada com sucesso via service");
}

// Testes para listEntities
async function testListEntitiesSuccess() {
  const result = await listEntities(mockEntity.enterprise_id as unknown as number);
  assert(Array.isArray(result), "Resultado deveria ser um array");
  console.log(`   ✓ ${result.length} entidades listadas via service`);
}

// Testes para readEntity
async function testReadEntityById() {
  const result = await readEntity(mockEntity.id!);
  assert(result !== null, "Resultado deveria existir");
  console.log("   ✓ Entidade encontrada por ID via service");
}

// Testes para updateEntity
async function testUpdateEntitySuccess() {
  const result = await updateEntity(mockEntity.id!, mockEntityUpdate);
  assert(result !== null, "Resultado deveria existir");
  console.log("   ✓ Entidade atualizada via service");
}

// Testes para deleteEntity (safe delete)
async function testUpdateSafeDeleteEntity() {
  const result = await deleteEntity(mockEntity.id!, true);
  assert(result !== null, "Resultado deveria existir");
  console.log("   ✓ Entidade desativada via service");
}

// Função principal para executar todos os testes
async function runAllTests() {
  console.log("🚀 Iniciando execução de todos os testes via services...\n");

  await runTest("Criar entidade", testCreateEntitySuccess);
  await runTest("Listar entidades", testListEntitiesSuccess);
  await runTest("Buscar entidade por ID", testReadEntityById);
  await runTest("Atualizar entidade", testUpdateEntitySuccess);
  await runTest("Safe delete da entidade", testUpdateSafeDeleteEntity);

  console.log("🎉 Todos os testes via services foram executados!");
}

// Executar todos os testes se o arquivo for executado diretamente
if (require.main === module) {
  runAllTests().catch(console.error);
}