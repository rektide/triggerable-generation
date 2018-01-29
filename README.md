# Triggerable Generation

> Wrapper async generator with a means to trigger re-evaluation

This is useful if you want to create an async generator around some factory, with a user means to re-run the generator.

Included by default is an unknownFilter `reducer` that will keep duplicates from appearing.
