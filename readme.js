#!/usr/bin/env node
// readme.js — claudetown repo interface
// Author: claudetown gen-2
// Created: 2026-04-16

const args = process.argv.slice(2);

// No args: help someone who just landed here
if (args.length === 0) {
  console.log(`
# Claudetown — Claude Platform Intelligence

Tracks Claude's evolving capabilities against the Nimbus corporal architecture.
Identifies where native Claude features can improve, replace, or obsolete
custom Nimbus components.

## What This Repo Is For

The Nimbus corporal system (corporals, fog, patches, evolution, messaging,
billets, thunder) was built before Claude had native equivalents for many
of these patterns. As Claude evolves, some of our custom infra may become
unnecessary. This repo tracks that convergence.

## Key Artifact

  FlowBrain island: c:/mindmap/A-FlowBrain/islands/core-claudetown/
  PALM_TREE.md has the capability mapping table

## Current Tracking Areas

  Corporals vs Claude Code sessions
  Fog vs Claude memory
  Patches/evolution vs CLAUDE.md + context compaction
  Thunder vs Agent SDK / remote agents
  convo2 messaging vs MCP servers
  Billets vs no native equivalent (yet)

## Holder

  claudetown (billet: claudetownPlatformIntel)
`);
  process.exit(0);
}

// --json: structured data for programmatic use
if (args.includes('--json')) {
  console.log(JSON.stringify({
    repo: 'claudetown',
    domain: 'Claude platform intelligence — tracking advances against Nimbus corporal architecture',
    island: 'core-claudetown',
    billet: 'claudetownPlatformIntel',
    holder: 'claudetown',
    tools: [],
    docs: [
      {
        name: 'PALM_TREE.md',
        path: 'c:/mindmap/A-FlowBrain/islands/core-claudetown/PALM_TREE.md',
        purpose: 'Capability mapping table — Nimbus patterns vs Claude native equivalents'
      }
    ],
    trackingAreas: [
      'Corporals vs Claude Code sessions',
      'Fog vs Claude memory',
      'Patches/evolution vs CLAUDE.md',
      'Thunder vs Agent SDK',
      'convo2 messaging vs MCP',
      'Billets (no native equivalent yet)'
    ],
    status: 'active'
  }, null, 2));
  process.exit(0);
}

// --library: show library contents
if (args.includes('--library')) {
  const fs = require('fs');
  const path = require('path');
  const indexPath = path.join(__dirname, 'library', 'INDEX.md');
  if (fs.existsSync(indexPath)) {
    console.log(fs.readFileSync(indexPath, 'utf8'));
  } else {
    console.log('No library/INDEX.md found.');
  }
  process.exit(0);
}

// --tools: list tools
if (args.includes('--tools')) {
  console.log('No tools yet. Claudetown is an intelligence/analysis project.');
  process.exit(0);
}

// --help: usage info
if (args.includes('--help')) {
  console.log(`readme.js — Claudetown repo interface`);
  console.log(`  Author: claudetown gen-2 | Created: 2026-04-16`);
  console.log(``);
  console.log(`Usage: node readme.js [--json | --tools | --library | --help]`);
  console.log(`  (no args)   What this repo does and how to use it`);
  console.log(`  --json      Structured data for programmatic use`);
  console.log(`  --tools     List tools in this repo`);
  console.log(`  --library   Show library index`);
  console.log(`  --help      This help message`);
  process.exit(0);
}

// Unknown argument
console.log(`Usage: node readme.js [--json | --tools | --library | --help]`);
console.log(`  (no args)   What this repo does and how to use it`);
console.log(`  --json      Structured data for programmatic use`);
console.log(`  --tools     List tools in this repo`);
console.log(`  --library   Show library index`);
console.log(`  --help      This help message`);
