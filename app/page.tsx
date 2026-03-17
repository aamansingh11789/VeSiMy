")
if start == -1:
    start = hist.find('original = r"""')
quote = "'''" if "original = r'''" in hist else '"""'
start += len(f"original = r{quote}")
end = hist.find(quote + "\n\n# Reconstruct", start)
full_code = hist[start:end]

# Minimal edits only:
# 1) Move // @ts-nocheck above 'use client'
full_code = full_code.replace("'use client'\n// @ts-nocheck", "// @ts-nocheck\n'use client'", 1)

# 2) Fix tuple typing for constellation nodes
old_block = """          {([
            [80,60,true],[200,140,false],[340,90,false],[480,180,true],[560,80,false],
            [700,150,true],[820,60,false],[960,140,false],[1100,80,true],[1300,60,false],
            [120,200,false],[300,220,false],[520,240,false],[780,220,false],[1060,320,true],
            [80,340,false],[300,340,false],[480,380,false],[700,340,false],[820,360,false],
            [960,420,true],[1060,540,false],[200,420,false],[340,500,false],[620,420,false],
            [820,480,false],[60,500,false],[200,560,false],[280,620,false],[700,540,true],
            [1140,460,false],[400,160,false],[900,280,false],[650,580,false],[1200,200,false],
            [1380,400,false],[780,640,false],[1060,640,false],
          ] as [number, number, boolean][])
            .map(([cx,cy,bright],i) => (
            <circle key={i} cx={cx} cy={cy}
              r={bright ? 2.8 : 1.6}
              fill="#C49B2E"
              className={bright && i%3===0 ? 'cn-pulse' : bright && i%3===1 ? 'cn-pulse2' : bright ? 'cn-pulse3' : ''}
              opacity={bright ? 0.28 : 0.13}/>
          ))}"""

new_block = """          {([
            [80,60,true],[200,140,false],[340,90,false],[480,180,true],[560,80,false],
            [700,150,true],[820,60,false],[960,140,false],[1100,80,true],[1300,60,false],
            [120,200,false],[300,220,false],[520,240,false],[780,220,false],[1060,320,true],
            [80,340,false],[300,340,false],[480,380,false],[700,340,false],[820,360,false],
            [960,420,true],[1060,540,false],[200,420,false],[340,500,false],[620,420,false],
            [820,480,false],[60,500,false],[200,560,false],[280,620,false],[700,540,true],
            [1140,460,false],[400,160,false],[900,280,false],[650,580,false],[1200,200,false],
            [1380,400,false],[780,640,false],[1060,640,false],
          ] as [number, number, boolean][])
            .map(([cx,cy,bright],i) => (
            <circle key={i} cx={cx} cy={cy}
              r={bright ? 2.8 : 1.6}
              fill="#C49B2E"
              className={bright && i%3===0 ? 'cn-pulse' : bright && i%3===1 ? 'cn-pulse2' : bright ? 'cn-pulse3' : ''}
              opacity={bright ? 0.28 : 0.13}/>
          ))}"""

full_code = full_code.replace(old_block, new_block, 1)

out = Path("/mnt/data/app-page-fixed.tsx")
out.write_text(full_code, encoding="utf-8")
print(f"Saved fixed file to {out}"