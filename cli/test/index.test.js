import test from "node:test";
import assert from "node:assert/strict";
import { buildProgram } from "../bin/index.js";

test("CLI exposes safe lifecycle commands", () => {
    const program = buildProgram();
    const commands = new Map(program.commands.map((command) => [command.name(), command]));

    assert.deepEqual([...commands.keys()], ["init", "update", "rollback", "status"]);
    assert.ok(commands.get("update").options.some((option) => option.long === "--strategy"));
    assert.ok(commands.get("update").options.some((option) => option.long === "--dry-run"));
    assert.ok(commands.get("rollback").options.some((option) => option.long === "--backup"));
});

test("CLI runs when invoked through an npm bin symlink", async (t) => {
    const { mkdtemp, mkdir, symlink, rm } = await import("node:fs/promises");
    const { tmpdir } = await import("node:os");
    const path = await import("node:path");
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const run = promisify(execFile);

    const dir = await mkdtemp(path.join(tmpdir(), "anti-kit-symlink-"));
    t.after(() => rm(dir, { recursive: true, force: true }));

    const binDir = path.join(dir, ".bin");
    await mkdir(binDir);
    const link = path.join(binDir, "anti-kit");
    await symlink(path.resolve("bin/index.js"), link);

    const { stdout } = await run(process.execPath, [link, "--version"]);
    assert.match(stdout.trim(), /^\d{4}\.\d+\.\d+$/);
});

test("CLI supports local source installation", async (t) => {
    const { mkdtemp, rm } = await import("node:fs/promises");
    const { tmpdir } = await import("node:os");
    const path = await import("node:path");
    const fse = (await import("fs-extra")).default;
    const { installOrUpdate } = await import("../bin/index.js");

    const testProjectDir = await mkdtemp(path.join(tmpdir(), "anti-kit-local-install-"));
    t.after(() => rm(testProjectDir, { recursive: true, force: true }));

    const repoRoot = path.resolve(import.meta.dirname, "..", "..");
    const report = await installOrUpdate(
        { path: testProjectDir, source: repoRoot, force: true, quiet: true },
        "init",
    );

    assert.ok(report.installedAt || report.toolkitVersion);
    const hasAtomicDesign = await fse.pathExists(
        path.join(testProjectDir, ".agents", "skills", "atomic-design", "SKILL.md"),
    );
    assert.equal(hasAtomicDesign, true);
    const hasFrontendMaster = await fse.pathExists(
        path.join(testProjectDir, ".agents", "workflows", "frontend-master.md"),
    );
    assert.equal(hasFrontendMaster, true);
});
